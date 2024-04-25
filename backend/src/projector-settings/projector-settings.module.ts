import { Module } from '@nestjs/common';
import { ProjectorSettingsService } from './projector-settings.service';
import { ProjectorSettingsController } from './projector-settings.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectorModule } from 'src/projector/projector.module';

@Module({
  controllers: [ProjectorSettingsController],
  providers: [ProjectorSettingsService],
  imports: [DatabaseModule, ProjectorModule],
})
export class ProjectorSettingsModule {}
