import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LiveStreamingService } from './live-streaming.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { execSync } from 'child_process';
import { stat, mkdir, writeFile, appendFile, rm } from 'fs/promises';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestOrganization, RequestOrganizationType } from 'src/auth/request-organization';
import { DisplayType } from 'src/database/structures/display-type.enum';
import { environment } from 'src/environment';
import { Repository } from 'typeorm';
import { DisplayState } from 'src/database/entities/display-state.entity';
import { ProjectorLastUpdateService } from 'src/projector/projector-last-update.service';
import { Response } from 'express';
import { m3u8PREFIX, PLAYLIST_NAME } from './consts';
@Controller('live-streaming')
export class LiveStreamingController {
  constructor(private readonly liveStreamingService: LiveStreamingService) { }


  @UseGuards(AuthGuard)
  @Post('/hls-stream/stop')
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
  @Post('/hls-stream/start')
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
      const exists = await stat(this.liveStreamingService.getChunkDirectory(organization.id));
      if (!exists.isDirectory()) {
        await mkdir(this.liveStreamingService.getChunkDirectory(organization.id), {
          recursive: true,
        });
      }
    } catch (e) {
      await mkdir(this.liveStreamingService.getChunkDirectory(organization.id), {
        recursive: true,
      });
    }

    await writeFile(this.liveStreamingService.getPlaylistPath(organization.id), m3u8PREFIX);
    this.projectorLastUpdateService.setLastUpdate(organization.id);
  }

  @UseGuards(AuthGuard)
  @Post('/hls-stream')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStreamChunk(
    @UploadedFile() file: Express.Multer.File,
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    const playlistPath = this.liveStreamingService.getPlaylistPath(organization.id);
    const chunkDirectory = this.liveStreamingService.getChunkDirectory(organization.id);
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

  @Get('/hls-stream-manifest/:organizationId')
  getStreamManifest(
    @Param('organizationId') organizationId: string,
    @Res() res: Response,
  ) {
    res.redirect(`/upload/hls/${organizationId}/${PLAYLIST_NAME}`);
  }
}
