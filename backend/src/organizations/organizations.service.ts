import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { RepositoryFactory } from 'src/database/repository.factory';
import { Repository } from 'typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { defaultProjectorStateTextState } from 'src/projector-management/structures/projector-state-text-state';
import { DisplayType } from 'src/projector-management/enums/display-type.enum';
import { DisplayState } from 'src/database/entities/display-state.entity';
import {
  ProjectorSettings,
  defaultProjectorSettings,
} from 'src/database/entities/projector-settings.entity';

@Injectable()
export class OrganizationsService {
  private readonly organizationRepository: Repository<Organization>;
  private readonly projectStateRepository: Repository<DisplayState>;
  private readonly projectorSettingsRepository: Repository<ProjectorSettings>;

  constructor(reposotoryFactory: RepositoryFactory) {
    this.organizationRepository = reposotoryFactory.getRepository(Organization);
    this.projectStateRepository = reposotoryFactory.getRepository(DisplayState);
    this.projectorSettingsRepository =
      reposotoryFactory.getRepository(ProjectorSettings);
  }

  async create(createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.organizationRepository.save(
      this.organizationRepository.create({
        accessCode: createOrganizationDto.accessCode,
        data: createOrganizationDto.data,
      }),
    );

    await this.projectStateRepository.save(
      this.projectStateRepository.create({
        organization: organization,
        textState: defaultProjectorStateTextState,
        displayType: DisplayType.TEXT,
        emptyDisplay: true,
      }),
    );

    await this.projectorSettingsRepository.save(
      this.projectorSettingsRepository.create({
        organization: organization,
        ...defaultProjectorSettings,
      }),
    );
  }

  async findAll() {
    const organizations = await this.organizationRepository.find();
    return organizations;
  }

  async findOne(id: number) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}
