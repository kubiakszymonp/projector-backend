import { Module } from '@nestjs/common';
import { ProjectorSettingsService } from './projector-settings.service';
import { ProjectorSettingsController } from './projector-settings.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProjectorSettingsController],
  providers: [ProjectorSettingsService],
  imports: [DatabaseModule],
})
export class ProjectorSettingsModule {}
