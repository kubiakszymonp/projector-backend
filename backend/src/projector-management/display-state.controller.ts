import { Controller, Body, Patch, UseGuards, Get } from '@nestjs/common';
import { DisplayStateService } from './display-state.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MovePageDto } from './dto/move-page.dto';
import { UpdateDisplayStateDto } from './dto/update-display-state.dto';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { AuthenticationData } from 'src/common/request-organization';
import { JwtAuthenticationData } from 'src/common/jwt-payload';

@ApiBearerAuth()
@ApiTags('display-state')
@Controller('display-state')
export class DisplayStateController {
  constructor(private readonly displayStateService: DisplayStateService) { }

  @UseGuards(AuthGuard)
  @Patch('move-page')
  movePage(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() movePageDto: MovePageDto,
  ) {
    return this.displayStateService.movePage(+authenticationData.organizationId, movePageDto);
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateDisplayState(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() updateDisplayStateDto: UpdateDisplayStateDto,
  ) {
    return this.displayStateService.update(
      +authenticationData.organizationId,
      updateDisplayStateDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  getDisplayState(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.displayStateService.get(+authenticationData.organizationId);
  }
}
