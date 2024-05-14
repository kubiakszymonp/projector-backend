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
import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { RenameUploadedFileDto } from './dto/rename-uploaded-file.dto';
import { UploadedFileDto } from './dto/uploaded-file.dto';
import { SetCurrentUploadedFileDto } from './dto/set-current-uploaded-file.dto';
import { Repository } from 'typeorm';
import { DisplayType } from 'src/projector-management/enums/display-type.enum';
import { DisplayState } from './entities/display-state.entity';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { AuthenticationData } from 'src/common/request-organization';
import { JwtAuthenticationData } from 'src/common/jwt-payload';

@ApiTags('uploaded-files')
@Controller('uploaded-files')
export class UploadedFilesController {

  constructor(
    private readonly uploadedFilesService: UploadedFilesService,
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
    return this.uploadedFilesService.upload(
      files.map((file) => {
        return new CreateUploadedFileDto(
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
  renameFile(@Body() renameFileDto: RenameUploadedFileDto) {
    return this.uploadedFilesService.renameFile(renameFileDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getFilesForOrganization(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<UploadedFileDto[]> {
    return this.uploadedFilesService.getFilesForOrganization(authenticationData.organizationId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.uploadedFilesService.remove(+id, +authenticationData.organizationId);
  }

  @UseGuards(AuthGuard)
  @Get('/current')
  getCurrentFileForOrganization(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<UploadedFileDto> {
    return this.uploadedFilesService.getCurrentFile(+authenticationData.organizationId);
  }

  @UseGuards(AuthGuard)
  @Patch('/current')
  setCurrentUploadedFile(
    @Body() setCurrentUploadedFileDto: SetCurrentUploadedFileDto,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.uploadedFilesService.setCurrentFile(
      +setCurrentUploadedFileDto.id,
      +authenticationData.organizationId,
    );
  }
}
