import { Injectable } from '@nestjs/common';
import { ProjectorSettingsDto } from './dto/projector-settings.dto';
import { RepositoryFactory } from 'src/database/repository.factory';
import { Repository } from 'typeorm';
import { ProjectorSettings } from 'src/database/entities/projector-settings.entity';

@Injectable()
export class ProjectorSettingsService {
  private projectorSettingsRepository: Repository<ProjectorSettings>;
  constructor(repoFactory: RepositoryFactory) {
    this.projectorSettingsRepository =
      repoFactory.getRepository(ProjectorSettings);
  }

  async update(
    organizationId: number,
    updateProjectorSettingDto: ProjectorSettingsDto,
  ) {
    const newProjectorSettings = this.projectorSettingsRepository.create({
      ...updateProjectorSettingDto,
      organization: { id: organizationId },
    });
    await this.projectorSettingsRepository.save(newProjectorSettings);
  }

  async get(organizationId: number): Promise<ProjectorSettings> {
    return this.projectorSettingsRepository.findOne({
      where: { organization: { id: organizationId } },
    });
  }
}
