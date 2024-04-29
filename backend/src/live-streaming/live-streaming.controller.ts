import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LiveStreamingService } from './live-streaming.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { execSync } from 'child_process';
import { stat, mkdir, writeFile, appendFile, rm } from 'fs/promises';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { DisplayType } from 'src/database/structures/display-type.enum';
import { environment } from 'src/environment';
import { Repository } from 'typeorm';
import { DisplayState } from 'src/database/entities/display-state.entity';
import { ProjectorLastUpdateService } from 'src/projector/projector-last-update.service';
import { Response } from 'express';
import { m3u8PREFIX, PLAYLIST_NAME } from './consts';
@Controller('live-streaming')
export class LiveStreamingController {
  constructor(private readonly liveStreamingService: LiveStreamingService) {}

  @UseGuards(AuthGuard)
  @Post('/hls-stream/stop')
  async stopStream(
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    await this.liveStreamingService.stopStream(organization.id);
  }

  @UseGuards(AuthGuard)
  @Post('/hls-stream/start')
  async startStream(
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    await this.liveStreamingService.startStream(organization.id);
  }

  @UseGuards(AuthGuard)
  @Post('/hls-stream')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStreamChunk(
    @UploadedFile() file: Express.Multer.File,
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    this.liveStreamingService.uploadStreamChunk(file.buffer, organization.id);
  }

  @Get('/hls-stream-manifest/:organizationId')
  getStreamManifest(
    @Param('organizationId') organizationId: string,
    @Res() res: Response,
  ) {
    res.redirect(`/upload/hls/${organizationId}/${PLAYLIST_NAME}`);
  }
}
