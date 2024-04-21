import { Controller, Body, Patch, UseGuards, Get } from '@nestjs/common';
import { DisplayStateService } from './display-state.service';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MovePageDto } from './dto/move-page.dto';
import { UpdateDisplayStateDto } from './dto/update-display-state.dto';

@ApiBearerAuth()
@ApiTags('display-state')
@Controller('display-state')
export class DisplayStateController {
  constructor(private readonly displayStateService: DisplayStateService) {}

  @UseGuards(AuthGuard)
  @Patch('move-page')
  movePage(
    @RequestOrganization() organization: RequestOrganizationType,
    @Body() movePageDto: MovePageDto,
  ) {
    return this.displayStateService.movePage(+organization.id, movePageDto);
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateDisplayState(
    @RequestOrganization() organization: RequestOrganizationType,
    @Body() updateDisplayStateDto: UpdateDisplayStateDto,
  ) {
    return this.displayStateService.update(
      +organization.id,
      updateDisplayStateDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  getDisplayState(
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    return this.displayStateService.get(+organization.id);
  }
}
