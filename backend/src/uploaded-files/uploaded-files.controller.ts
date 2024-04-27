import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadedFilesService } from './uploaded-files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { RenameUploadedFileDto } from './dto/rename-uploaded-file.dto';
import { UploadedFileDto } from './dto/uploaded-file.dto';
import { SetCurrentUploadedFileDto } from './dto/set-current-uploaded-file.dto';
import { execSync } from 'child_process';
import { Response } from 'express';
import { appendFile, mkdir, readdir, rm, stat, writeFile } from 'fs/promises';
import { Repository } from 'typeorm';
import { DisplayState } from 'src/database/entities/display-state.entity';
import { RepositoryFactory } from 'src/database/repository.factory';
import { DisplayType } from 'src/database/structures/display-type.enum';
import { environment } from 'src/environment';
import { ProjectorLastUpdateService } from 'src/projector/projector-last-update.service';

const CHUNK_DURATION = 0.5;
const m3u8PREFIX = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:${CHUNK_DURATION}
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD\n`;
const HLS_DIRECTORY = '../upload/hls';
const PLAYLIST_NAME = 'playlist.m3u8';
const DELETE_CHUNK_AFTER_MILLIS = 1000 * 60;

@ApiTags('uploaded-files')
@Controller('uploaded-files')
export class UploadedFilesController {
  private displayStateRepository: Repository<DisplayState>;
  constructor(
    private readonly uploadedFilesService: UploadedFilesService,
    repoFactory: RepositoryFactory,
    private projectorLastUpdateService: ProjectorLastUpdateService,
  ) {
    setInterval(() => {
      this.clearOldChunks();
    }, 60_000);

    this.displayStateRepository = repoFactory.getRepository(DisplayState);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 100))
  uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    return this.uploadedFilesService.upload(
      files.map((file) => {
        return new CreateUploadedFileDto(
          file.originalname,
          file.mimetype,
          file.size,
          file.buffer,
          organization.id,
        );
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch()
  renameFile(@Body() renameFileDto: RenameUploadedFileDto) {
    return this.uploadedFilesService.renameFile(renameFileDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getFilesForOrganization(
    @RequestOrganization() organization: RequestOrganizationType,
  ): Promise<UploadedFileDto[]> {
    return this.uploadedFilesService.getFilesForOrganization(organization.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    return this.uploadedFilesService.remove(+id, +organization.id);
  }

  @UseGuards(AuthGuard)
  @Get('/current')
  getCurrentFileForOrganization(
    @RequestOrganization() organization: RequestOrganizationType,
  ): Promise<UploadedFileDto> {
    return this.uploadedFilesService.getCurrentFile(+organization.id);
  }

  @UseGuards(AuthGuard)
  @Patch('/current')
  setCurrentUploadedFile(
    @Body() setCurrentUploadedFileDto: SetCurrentUploadedFileDto,
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    return this.uploadedFilesService.setCurrentFile(
      +setCurrentUploadedFileDto.id,
      +organization.id,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/stream/stop')
  async stopStream(
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organization: { id: organization.id } },
    });

    const newDisplayState = this.displayStateRepository.create({
      ...displayState,
      emptyDisplay: true,
    });

    await this.displayStateRepository.save(newDisplayState);
    this.projectorLastUpdateService.setLastUpdate(organization.id);
  }

  @UseGuards(AuthGuard)
  @Post('/stream/start')
  async startStream(
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organization: { id: organization.id } },
    });

    const newDisplayState = this.displayStateRepository.create({
      ...displayState,
      displayType: DisplayType.HLS,
    });

    await this.displayStateRepository.save(newDisplayState);

    // check if directory exists
    try {
      const exists = await stat(this.getChunkDirectory(organization.id));
      if (!exists.isDirectory()) {
        await mkdir(this.getChunkDirectory(organization.id), {
          recursive: true,
        });
      }
    } catch (e) {
      await mkdir(this.getChunkDirectory(organization.id), {
        recursive: true,
      });
    }

    await writeFile(this.getPlaylistPath(organization.id), m3u8PREFIX);
    this.projectorLastUpdateService.setLastUpdate(organization.id);
  }

  @UseGuards(AuthGuard)
  @Post('/stream')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStreamChunk(
    @UploadedFile() file: Express.Multer.File,
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    const playlistPath = this.getPlaylistPath(organization.id);
    const chunkDirectory = this.getChunkDirectory(organization.id);
    const fileName = `${new Date().getTime().toString()}`;

    try {
      await appendFile(chunkDirectory + `/${fileName}.webm`, file.buffer);

      const inputPath = chunkDirectory + `/${fileName}.webm`;
      const outputPath = chunkDirectory + `/${fileName}.ts`;

      execSync(
        `${environment.FFMPEG_PATH} -i ${inputPath} -c:v libx264 -preset ultrafast -tune zerolatency -c:a aac -b:a 192k -f mpegts ${outputPath}`,
      );

      const duration = this.getVideoDuration(outputPath);

      appendFile(
        playlistPath,
        `#EXTINF:${duration},
      chunks/${fileName}.ts\n`,
      );

      rm(inputPath);
    } catch (e) {
      console.error(e);
    }
  }

  @Get('/stream-manifest/:organizationId')
  getStreamManifest(
    @Param('organizationId') organizationId: string,
    @Res() res: Response,
  ) {
    res.redirect(`/upload/hls/${organizationId}/${PLAYLIST_NAME}`);
  }

  private getPlaylistPath(organizationId: number) {
    return `${HLS_DIRECTORY}/${organizationId}/${PLAYLIST_NAME}`;
  }

  private getChunkDirectory(organizationId: number) {
    return `${HLS_DIRECTORY}/${organizationId}/chunks`;
  }

  private async clearOldChunks() {
    try {
      const organizationIds = await readdir(HLS_DIRECTORY);
      organizationIds.forEach(async (organizationId) => {
        try {
          const chunkDirectory = this.getChunkDirectory(
            parseInt(organizationId),
          );
          const files = await readdir(chunkDirectory);
          const currentTime = new Date().getTime();
          files.forEach((file) => {
            const fileNameWithoutExtension = file.split('.')[0];
            const fileNumber = parseInt(fileNameWithoutExtension);
            if (currentTime - fileNumber > DELETE_CHUNK_AFTER_MILLIS) {
              rm(`${chunkDirectory}/${file}`);
            }
          });
        } catch (e) {}
      });
    } catch (e) {}
  }

  private getVideoDuration(inputPath) {
    try {
      const command = `${environment.FFPROBE_PATH} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`;
      const duration = execSync(command).toString().trim();
      console.log({ duration });
      return parseFloat(duration);
    } catch (e) {
      console.error('Error extracting video duration:', e);
      return null;
    }
  }
}
