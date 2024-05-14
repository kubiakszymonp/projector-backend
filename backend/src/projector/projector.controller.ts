import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProjectorService } from './projector.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetProjectorStateDto } from './dto/projector-state.dto';
import { ProjectorLastUpdateService } from './projector-last-update.service';

@ApiBearerAuth()
@ApiTags('projector')
@Controller('projector')
export class ProjectorController {
  constructor(
    private readonly projectorService: ProjectorService,
    private projectorLastUpdateService: ProjectorLastUpdateService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  getProjectorState(
   @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<GetProjectorStateDto> {
    return this.projectorService.getState(organization.id);
  }

  @Get(':organizationId')
  async getProjectorStateByOrganizationId(
    @Param('organizationId') organizationId: number,
  ): Promise<GetProjectorStateDto> {
    return this.projectorService.getState(organizationId);
  }

  @Get('last-update/:organizationId')
  getLastUpdateTimestamp(@Param('organizationId') organizationId: number) {
    return this.projectorLastUpdateService.getLastUpdate(organizationId);
  }
}
