import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LiveStreamingService } from '../services/live-streaming.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { PLAYLIST_NAME } from 'src/common/consts';

@ApiTags('live-streaming')
@Controller('live-streaming')
export class LiveStreamingController {
  constructor(private readonly liveStreamingService: LiveStreamingService) { }

  @UseGuards(AuthGuard)
  @Post('/hls-stream/stop')
  async stopStream(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    await this.liveStreamingService.stopStream(authenticationData.organizationId);
  }

  @UseGuards(AuthGuard)
  @Post('/hls-stream/start')
  async startStream(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    await this.liveStreamingService.startStream(authenticationData.organizationId);
  }

  @UseGuards(AuthGuard)
  @Post('/hls-stream')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStreamChunk(
    @UploadedFile() file: Express.Multer.File,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    this.liveStreamingService.uploadStreamChunk(file.buffer, authenticationData.organizationId);
  }

  @Get('/hls-stream-manifest/:organizationId')
  getStreamManifest(
    @Param('organizationId') organizationId: string,
    @Res() res: Response,
  ) {
    res.redirect(`/upload/hls/${organizationId}/${PLAYLIST_NAME}`);
  }
}
