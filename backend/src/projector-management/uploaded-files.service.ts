import { Injectable } from '@nestjs/common';
import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { Repository } from 'typeorm';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { RenameUploadedFileDto } from './dto/rename-uploaded-file.dto';
import { DisplayType } from 'src/projector-management/enums/display-type.enum';
import { ProjectorLastUpdateService } from 'src/projector/projector-last-update.service';
import { rm, stat } from 'fs/promises';
import { UploadedFile } from './entities/uploaded-file.entity';
import { DisplayState } from './entities/display-state.entity';

@Injectable()
export class UploadedFilesService {

  constructor(private readonly uploadedFilesRepository: Repository<UploadedFile>,
    private readonly displayStateRepository: Repository<DisplayState>,
    private projectorLastUpdateService: ProjectorLastUpdateService) {

  }

  async upload(uploadedFileDtos: CreateUploadedFileDto[]) {
    await this.uploadedFilesRepository.insert(uploadedFileDtos);
    this.storeUploadedFiles(uploadedFileDtos);
  }

  async storeUploadedFiles(uploadedFileDtos: CreateUploadedFileDto[]) {
    const uploadedDirectory = '../upload';

    if (!existsSync(uploadedDirectory)) {
      mkdirSync(uploadedDirectory, { recursive: true });
    }

    uploadedFileDtos.forEach((uploadedFileDto) => {
      const pathToSave = `${uploadedDirectory}/${uploadedFileDto.url}`;
      writeFileSync(pathToSave, uploadedFileDto.buffer);
    });
  }

  async removeStoredFile(url: string) {
    const pathToRemove = `../upload/${url}`;
    if (await stat(pathToRemove)) {
      await rm(pathToRemove);
    }
  }

  async renameFile(renameFileDto: RenameUploadedFileDto) {
    await this.uploadedFilesRepository.update(renameFileDto.id, {
      name: renameFileDto.name,
    });
  }

  async getFilesForOrganization(organizationId: number) {
    return this.uploadedFilesRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number, organizationId: number) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
      relations: ['uploadedFile'],
    });

    if (displayState.uploadedFile.id === id) {
      await this.displayStateRepository.update(displayState.id, {
        uploadedFile: null,
        emptyDisplay: true,
      });
    }

    const uploadedFile = await this.uploadedFilesRepository.findOne({
      where: { id },
    });
    await this.uploadedFilesRepository.delete(uploadedFile.id);
    this.removeStoredFile(uploadedFile.url);
    this.removeStoredFile(uploadedFile.previewUrl);
  }

  async getCurrentFile(organizationId: number) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
      relations: ['uploadedFile'],
    });
    if (displayState.displayType === DisplayType.MEDIA)
      return displayState.uploadedFile;
  }

  async setCurrentFile(fileId: number, organizationId: number) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
    });

    const uploadedFile = await this.uploadedFilesRepository.findOne({
      where: { id: fileId },
    });

    if (!displayState || !uploadedFile) {
      throw new Error('No display state or uploaded file found');
    }

    const newDisplayState = this.displayStateRepository.create({
      ...displayState,
      displayType: DisplayType.MEDIA,
      emptyDisplay: false,
      uploadedFile,
    });

    await this.displayStateRepository.save(newDisplayState);
    this.projectorLastUpdateService.setLastUpdate(organizationId);
  }
}
