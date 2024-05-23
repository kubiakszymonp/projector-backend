import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateMediaFileDto } from '../dto/update/update-media-file.dto';
import { GetMediaFileDto } from '../dto/get/get-media-file.dto';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { MediaFilesService } from '../services/media-files.service';
import { MediaFileStructure } from '../structures/media-file-structure';

@ApiTags('media-files')
@Controller('media-files')
export class MediaFilesController {

  constructor(
    private readonly mediaFilesService: MediaFilesService,
  ) {
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 100))
  uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.mediaFilesService.upload(
      files.map((file) => {
        return new MediaFileStructure(
          file.originalname,
          file.mimetype,
          file.size,
          file.buffer,
          authenticationData.organizationId,
        );
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch()
  renameFile(@Body() renameFileDto: UpdateMediaFileDto) {
    return this.mediaFilesService.update(renameFileDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getFilesForOrganization(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<GetMediaFileDto[]> {
    return this.mediaFilesService.findAllForOrganization(authenticationData.organizationId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.mediaFilesService.delete(+id, +authenticationData.organizationId);
  }
}
