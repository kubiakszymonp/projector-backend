import { Module } from '@nestjs/common';
import { LiveStreamingService } from './live-streaming.service';
import { LiveStreamingController } from './live-streaming.controller';

@Module({
  controllers: [LiveStreamingController],
  providers: [LiveStreamingService],
})
export class LiveStreamingModule {}
