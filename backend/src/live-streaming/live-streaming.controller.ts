// import {
//   Controller,
//   Get,
//   Post,
//   Param,
//   Res,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { LiveStreamingService } from './live-streaming.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { AuthGuard } from 'src/auth/auth.guard';
// import { Response } from 'express';
// import { PLAYLIST_NAME } from './consts';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('live-streaming')
// @Controller('live-streaming')
// export class LiveStreamingController {
//   constructor(private readonly liveStreamingService: LiveStreamingService) {}

//   @UseGuards(AuthGuard)
//   @Post('/hls-stream/stop')
//   async stopStream(
//     @RequestOrganization() organization: RequestOrganizationType,
//   ) {
//     await this.liveStreamingService.stopStream(organization.id);
//   }

//   @UseGuards(AuthGuard)
//   @Post('/hls-stream/start')
//   async startStream(
//     @RequestOrganization() organization: RequestOrganizationType,
//   ) {
//     await this.liveStreamingService.startStream(organization.id);
//   }

//   @UseGuards(AuthGuard)
//   @Post('/hls-stream')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadStreamChunk(
//     @UploadedFile() file: Express.Multer.File,
//     @RequestOrganization() organization: RequestOrganizationType,
//   ) {
//     this.liveStreamingService.uploadStreamChunk(file.buffer, organization.id);
//   }

//   @Get('/hls-stream-manifest/:organizationId')
//   getStreamManifest(
//     @Param('organizationId') organizationId: string,
//     @Res() res: Response,
//   ) {
//     res.redirect(`/upload/hls/${organizationId}/${PLAYLIST_NAME}`);
//   }
// }
