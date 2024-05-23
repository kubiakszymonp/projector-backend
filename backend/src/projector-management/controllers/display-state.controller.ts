import { Controller, Body, Patch, UseGuards, Get, Post } from '@nestjs/common';
import { DisplayStateService } from '../services/display-state.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MovePageDto } from '../dto/update/move-page.dto';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { UpdateDisplayStateDto } from '../dto/update/update-display-state.dto';

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
    return this.displayStateService.findOne(+authenticationData.organizationId);
  }

  @UseGuards(AuthGuard)
  @Post()
  createDisplayState(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.displayStateService.create(+authenticationData.organizationId);
  }
}
