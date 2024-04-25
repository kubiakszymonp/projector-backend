import { Module } from '@nestjs/common';
import { DisplayStateService } from './display-state.service';
import { DisplayStateController } from './display-state.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectorModule } from 'src/projector/projector.module';

@Module({
  controllers: [DisplayStateController],
  providers: [DisplayStateService],
  imports: [DatabaseModule, ProjectorModule],
})
export class DisplayStateModule {}
