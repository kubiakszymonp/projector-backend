import { Controller, Body, Patch, UseGuards, Get, Param, Post } from '@nestjs/common';
import { ProjectorSettingsService } from '../services/projector-settings.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { UpdateProjectorSettingDto } from '../dto/update/update-projector-settings.dto';
import { GetProjectorSettingsDto } from '../dto/get/get-projector-settings.dto';

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
    @Body() updateProjectorSettingDto: UpdateProjectorSettingDto,
  ) {

    return this.projectorSettingsService.update(
      authenticationData.organizationId,
      updateProjectorSettingDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async getSetting(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<GetProjectorSettingsDto> {
    return this.projectorSettingsService.findOne(authenticationData.organizationId);
  }

  @Get(':organizationId')
  async getSettingsByOrganizationId(
    @Param('organizationId') organizationId: string,
  ): Promise<GetProjectorSettingsDto> {
    return await this.projectorSettingsService.findOne(organizationId);
  }

  @UseGuards(AuthGuard)
  @Post()
  createF(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.projectorSettingsService.create(authenticationData.organizationId);
  }
}
