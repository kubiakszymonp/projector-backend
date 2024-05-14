import { BadGatewayException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectorLastUpdateService } from 'src/projector/projector-last-update.service';
import { PartialProjectorSettingsConfigurationDto } from './dto/partial-projector-settings.dto';
import { ProjectorSettings } from './entities/projector-settings.entity';

@Injectable()
export class ProjectorSettingsService {

    constructor(
        private projectorSettingsRepository: Repository<ProjectorSettings>,
        private projectorLastUpdateService: ProjectorLastUpdateService,
    ) {
    }

    async update(
        organizationId: number,
        updateProjectorSettingDto: PartialProjectorSettingsConfigurationDto,
    ) {
        const projectorSettings = await this.projectorSettingsRepository.findOne({
            where: { organizationId },
        });

        if (!projectorSettings) {
            throw new BadGatewayException('Projector settings not found');
        }

        const newProjectorSettings = this.projectorSettingsRepository.create({
            ...projectorSettings,
            ...updateProjectorSettingDto,
            organizationId,
        });
        await this.projectorSettingsRepository.save(newProjectorSettings);
        this.projectorLastUpdateService.setLastUpdate(organizationId);
    }

    async get(organizationId: number): Promise<ProjectorSettings> {
        return this.projectorSettingsRepository.findOne({
            where: { organizationId },
        });
    }
}
