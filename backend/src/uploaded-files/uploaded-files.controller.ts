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

@ApiTags('uploaded-files')
@Controller('uploaded-files')
export class UploadedFilesController {
  private displayStateRepository: Repository<DisplayState>;
  constructor(
    private readonly uploadedFilesService: UploadedFilesService,
    repoFactory: RepositoryFactory,
    private projectorLastUpdateService: ProjectorLastUpdateService,
  ) {
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
}
