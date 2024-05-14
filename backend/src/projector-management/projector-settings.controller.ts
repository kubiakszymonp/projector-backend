import { Controller, Body, Patch, UseGuards, Get, Param } from '@nestjs/common';
import { ProjectorSettingsService } from './projector-settings.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectorSettingsConfigurationDto } from 'src/projector-management/structures/projector-settings-configuration';
import { PartialProjectorSettingsConfigurationDto } from './dto/partial-projector-settings.dto';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';

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
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() updateProjectorSettingDto: PartialProjectorSettingsConfigurationDto,
  ) {

    return this.projectorSettingsService.update(
      authenticationData.organizationId,
      updateProjectorSettingDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  getSetting(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<ProjectorSettingsConfigurationDto> {
    return this.projectorSettingsService.get(authenticationData.organizationId);
  }

  @Get(':organizationId')
  getSettingsByOrganizationId(
    @Param('organizationId') organizationId: number,
  ): Promise<ProjectorSettingsConfigurationDto> {
    return this.projectorSettingsService.get(organizationId);
  }
}
