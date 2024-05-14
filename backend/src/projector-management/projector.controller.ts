import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProjectorService } from './projector.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetProjectorStateDto } from './dto/projector-state.dto';
import { ProjectorLastUpdateService } from './projector-last-update.service';
import { AuthenticationData } from 'src/common/request-organization';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('projector')
@Controller('projector')
export class ProjectorController {
  constructor(
    private readonly projectorService: ProjectorService,
    private projectorLastUpdateService: ProjectorLastUpdateService,
  ) { }

  @UseGuards(AuthGuard)
  @Get()
  getProjectorState(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<GetProjectorStateDto> {
    return this.projectorService.getState(authenticationData.organizationId);
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
