import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { PLAYLIST_NAME } from 'src/common/consts';
import { WebRtcSignalingService } from '../services/webrtc-signaling.service';
import { WebRtcSdpDto } from '../dto/get/webrtc-sdp.dto';
import { ExportWebRtcScreenDto } from '../dto/update/send-wer-rtc-screen.dto';
import { ProjectorChangeNotificationGateway } from '../services/projector-change-notification.gateway';

@ApiTags('webrtc-stream')
@Controller('webrtc-stream')
export class WebRtcController {

  constructor(private webRtcSignalingService: WebRtcSignalingService,
    private projectorChangeNotificationGateway: ProjectorChangeNotificationGateway) { }

  @UseGuards(AuthGuard)
  @Get()
  async getState(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.webRtcSignalingService.getState(authenticationData.organizationId.toString());
  }

  @UseGuards(AuthGuard)
  @Post("offer")
  async setOffer(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() offer: WebRtcSdpDto,
  ) {
    await this.webRtcSignalingService.setOffer(authenticationData.organizationId.toString(), offer);
    this.projectorChangeNotificationGateway.notifyWebRtcOffer(authenticationData.organizationId.toString(), offer.screenId, offer);
  }

  @UseGuards(AuthGuard)
  @Post("answer")
  async setAnswer(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() answer: WebRtcSdpDto,
  ) {
    await this.webRtcSignalingService.setAnswer(authenticationData.organizationId.toString(), answer);
    this.projectorChangeNotificationGateway.notifyWebRtcAnswer(authenticationData.organizationId.toString(), answer.screenId, answer);
  }

  @UseGuards(AuthGuard)
  @Post("screen")
  async setScreen(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() exportWebRtcScreenDto: ExportWebRtcScreenDto,
  ) {
    await this.webRtcSignalingService.setWaitingScreen(authenticationData.organizationId.toString(), exportWebRtcScreenDto.screenId);
    this.projectorChangeNotificationGateway.notifyUpdateOrganization(authenticationData.organizationId.toString());
  }

  @UseGuards(AuthGuard)
  @Delete("screen")
  async removeScreen(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() exportWebRtcScreenDto: ExportWebRtcScreenDto,
  ) {
    await this.webRtcSignalingService.removeScreen(authenticationData.organizationId.toString(), exportWebRtcScreenDto.screenId);

    //this.projectorChangeNotificationGateway.notifyUpdateOrganization(authenticationData.organizationId.toString());
  }

  @UseGuards(AuthGuard)
  @Delete()
  async clearOrganization(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    await this.webRtcSignalingService.clearOrganization(authenticationData.organizationId.toString());
   // this.projectorChangeNotificationGateway.notifyUpdateOrganization(authenticationData.organizationId.toString());
  }

}
