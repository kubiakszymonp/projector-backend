import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProjectorService } from './projector.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetProjectorStateDto } from './dto/projector-state.dto';

@ApiBearerAuth()
@ApiTags('projector')
@Controller('projector')
export class ProjectorController {
  constructor(private readonly projectorService: ProjectorService) {}

  @UseGuards(AuthGuard)
  @Get()
  getProjectorState(
    @RequestOrganization() organization: RequestOrganizationType,
  ): Promise<GetProjectorStateDto> {
    return this.projectorService.getState(organization.id);
  }

  @Get(':organizationId')
  async getProjectorStateByOrganizationId(
    @Param('organizationId') organizationId: number,
  ): Promise<GetProjectorStateDto> {
    return this.projectorService.getState(organizationId);
  }
}
