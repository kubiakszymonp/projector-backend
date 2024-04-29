import { Module } from '@nestjs/common';
import { LiveStreamingService } from './live-streaming.service';
import { LiveStreamingController } from './live-streaming.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectorModule } from 'src/projector/projector.module';

@Module({
  controllers: [LiveStreamingController],
  providers: [LiveStreamingService],
  imports: [DatabaseModule, ProjectorModule],
})
export class LiveStreamingModule {}
