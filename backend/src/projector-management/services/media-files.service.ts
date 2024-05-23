import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { DisplayTypeEnum } from 'src/projector-management/enums/display-type.enum';
import { rm, stat } from 'fs/promises';
import { DisplayState } from '../entities/display-state.entity';
import { MediaFile } from '../entities/media-file.entity';
import { UpdateMediaFileDto } from '../dto/update/update-media-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DisplayStateService } from './display-state.service';
import { GetMediaFileDto } from '../dto/get/get-media-file.dto';
import { MediaFileStructure } from '../structures/media-file-structure';
import { ENVIRONMENT } from 'src/environment';
import { join } from 'path';

@Injectable()
export class MediaFilesService {

  constructor(@InjectRepository(MediaFile) private readonly mediaFilesRepository: Repository<MediaFile>,
    private displayStateService: DisplayStateService) {

  }

  async upload(mediaFileStructures: MediaFileStructure[]) {
    await this.mediaFilesRepository.insert(mediaFileStructures);
    this.storeMediaFiles(mediaFileStructures);
  }

  async getMediaFile(id: number): Promise<GetMediaFileDto> {
    const mediaFile = await this.mediaFilesRepository.findOne({
      where: { id },
    });

    return {
      id: mediaFile.id,
      name: mediaFile.name,
      url: mediaFile.url,
      mimeType: mediaFile.mimeType,
      createdAt: mediaFile.createdAt,
      size: mediaFile.size,
    }
  }

  async update(updateMediaFileDto: UpdateMediaFileDto) {
    const mediaFile = await this.getMediaFile(updateMediaFileDto.id);
    await this.mediaFilesRepository.update(mediaFile.id, {
      ...mediaFile,
      ...updateMediaFileDto,
    });
    return this.getMediaFile(updateMediaFileDto.id);
  }

  async findAllForOrganization(organizationId: number): Promise<GetMediaFileDto[]> {
    return this.mediaFilesRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: number, organizationId: number) {
    const displayState = await this.displayStateService.findOne(organizationId);

    if (displayState.mediaFileId === id) {
      await this.displayStateService.update(organizationId, {
        ...displayState,
        mediaFileId: null,
        emptyDisplay: true,
      });
    }

    const mediaFile = await this.mediaFilesRepository.findOne({
      where: { id },
    });
    await this.mediaFilesRepository.delete(mediaFile.id);
    this.removeStoredFile(mediaFile.url);
  }

  private async storeMediaFiles(mediaFileStructures: MediaFileStructure[]) {
    const mediaDirectory = ENVIRONMENT.FILE_UPLOAD_PATH;

    if (!existsSync(mediaDirectory)) {
      mkdirSync(mediaDirectory, { recursive: true });
    }

    mediaFileStructures.forEach((mediaFileDto) => {
      const pathToSave = `${mediaDirectory}/${mediaFileDto.url}`;
      writeFileSync(pathToSave, mediaFileDto.buffer);
    });
  }

  private async removeStoredFile(url: string) {
    const pathToRemove = join(ENVIRONMENT.FILE_UPLOAD_PATH, url);
    if (await stat(pathToRemove)) {
      await rm(pathToRemove);
    }
  }
}
