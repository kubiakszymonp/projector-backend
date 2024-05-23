import { BadGatewayException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectorSettings } from '../entities/projector-settings.entity';
import { GetProjectorSettingsDto } from '../dto/get/get-projector-settings.dto';
import { UpdateProjectorSettingDto } from '../dto/update/update-projector-settings.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectorSettingsService {

    constructor(
        @InjectRepository(ProjectorSettings) private projectorSettingsRepository: Repository<ProjectorSettings>,
    ) {
    }

    async create(organizationId: number) {
        const projectorSettings = this.projectorSettingsRepository.create({
            organizationId,
        });

        await this.projectorSettingsRepository.save(projectorSettings);

        return this.findOne(organizationId);
    }

    async update(
        organizationId: number,
        updateProjectorSettingDto: UpdateProjectorSettingDto,
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
        return this.findOne(organizationId);
    }

    async findOne(organizationId: number): Promise<GetProjectorSettingsDto> {
        return this.projectorSettingsRepository.findOne({
            where: { organizationId },
        });
    }
}
