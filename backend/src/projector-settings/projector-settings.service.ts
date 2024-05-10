import { BadGatewayException, Injectable } from '@nestjs/common';
import { RepositoryFactory } from 'src/database/repository.factory';
import { Repository } from 'typeorm';
import { ProjectorSettings } from 'src/database/entities/projector-settings.entity';
import { ProjectorSettingsConfigurationDto } from 'src/database/structures/projector-settings-configuration';
import { ProjectorLastUpdateService } from 'src/projector/projector-last-update.service';
import { PartialProjectorSettingsConfigurationDto } from './dto/partial-projector-settings.dto';

@Injectable()
export class ProjectorSettingsService {
  private projectorSettingsRepository: Repository<ProjectorSettings>;
  constructor(
    repoFactory: RepositoryFactory,
    private projectorLastUpdateService: ProjectorLastUpdateService,
  ) {
    this.projectorSettingsRepository =
      repoFactory.getRepository(ProjectorSettings);
  }

  async update(
    organizationId: number,
    updateProjectorSettingDto: PartialProjectorSettingsConfigurationDto,
  ) {
    const projectorSettings = await this.projectorSettingsRepository.findOne({
      where: { organization: { id: organizationId } },
    });

    if (!projectorSettings) {
      throw new BadGatewayException('Projector settings not found');
    }

    const newProjectorSettings = this.projectorSettingsRepository.create({
      ...updateProjectorSettingDto,
      ...projectorSettings,
      organization: { id: organizationId },
    });
    await this.projectorSettingsRepository.save(newProjectorSettings);
    this.projectorLastUpdateService.setLastUpdate(organizationId);
  }

  async get(organizationId: number): Promise<ProjectorSettings> {
    return this.projectorSettingsRepository.findOne({
      where: { organization: { id: organizationId } },
    });
  }
}
