import { Controller, Body, Patch, UseGuards, Get, Param } from '@nestjs/common';
import { ProjectorSettingsService } from './projector-settings.service';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProjectorSettingsConfigurationDto } from 'src/projector-management/structures/projector-settings-configuration';
import { PartialProjectorSettingsConfigurationDto } from './dto/partial-projector-settings.dto';

@ApiBearerAuth()
@ApiTags('projector-settings')
@Controller('projector-settings')
export class ProjectorSettingsController {
  constructor(
    private readonly projectorSettingsService: ProjectorSettingsService,
  ) { }

  @UseGuards(AuthGuard)
  @Patch()
  update(
    @RequestOrganization() organization: RequestOrganizationType,
    @Body() updateProjectorSettingDto: PartialProjectorSettingsConfigurationDto,
  ) {

    return this.projectorSettingsService.update(
      organization.id,
      updateProjectorSettingDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  getSetting(
    @RequestOrganization() organization: RequestOrganizationType,
  ): Promise<ProjectorSettingsConfigurationDto> {
    return this.projectorSettingsService.get(organization.id);
  }

  @Get(':organizationId')
  getSettingsByOrganizationId(
    @Param('organizationId') organizationId: number,
  ): Promise<ProjectorSettingsConfigurationDto> {
    return this.projectorSettingsService.get(organizationId);
  }
}
