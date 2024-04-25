import { Module } from '@nestjs/common';
import { ProjectorService } from './projector.service';
import { ProjectorController } from './projector.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectorLastUpdateService } from './projector-last-update.service';

@Module({
  controllers: [ProjectorController],
  providers: [ProjectorService, ProjectorLastUpdateService],
  imports: [DatabaseModule],
  exports: [ProjectorLastUpdateService],
})
export class ProjectorModule {}
