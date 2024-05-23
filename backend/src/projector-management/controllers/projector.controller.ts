import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProjectorService } from '../services/projector.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { GetDisplayDto } from '../dto/get/get-display.dto';

@ApiBearerAuth()
@ApiTags('projector')
@Controller('projector')
export class ProjectorController {
  constructor(
    private readonly projectorService: ProjectorService
  ) { }

  @UseGuards(AuthGuard)
  @Get()
  getProjectorState(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<GetDisplayDto> {
    return this.projectorService.getState(authenticationData.organizationId);
  }

  @Get(':organizationId')
  async getProjectorStateByOrganizationId(
    @Param('organizationId') organizationId: number,
  ): Promise<GetDisplayDto> {
    return this.projectorService.getState(organizationId);
  }
}
