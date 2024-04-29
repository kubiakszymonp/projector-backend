import { Module } from '@nestjs/common';
import { ProjectorService } from './projector.service';
import { ProjectorController } from './projector.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectorLastUpdateService } from './projector-last-update.service';
import { ProjectorGateway } from './projector.gateway';

@Module({
  controllers: [ProjectorController],
  providers: [ProjectorService, ProjectorLastUpdateService, ProjectorGateway],
  imports: [DatabaseModule],
  exports: [ProjectorLastUpdateService],
})
export class ProjectorModule {}
