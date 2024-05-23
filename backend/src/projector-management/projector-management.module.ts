import { Module } from '@nestjs/common';
import { DisplayStateService } from './services/display-state.service';
import { ProjectorChangeNotificationGateway } from './services/projector-change-notification.gateway';
import { ProjectorSettingsService } from './services/projector-settings.service';
import { ProjectorService } from './services/projector.service';
import { MediaFilesService } from './services/media-files.service';
import { WebRtcSignalingService } from './services/webrtc-signaling.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisplayState } from './entities/display-state.entity';
import { MediaFile } from './entities/media-file.entity';
import { ProjectorSettings } from './entities/projector-settings.entity';
import { TextUnitResourcesModule } from 'src/text-unit-resources/text-unit-resources.module';
import { DisplayStateController } from './controllers/display-state.controller';
import { ProjectorSettingsController } from './controllers/projector-settings.controller';
import { ProjectorController } from './controllers/projector.controller';
import { MediaFilesController } from './controllers/uploaded-files.controller';

@Module({
  controllers: [DisplayStateController, ProjectorSettingsController, ProjectorController, MediaFilesController],
  providers: [DisplayStateService,
    ProjectorChangeNotificationGateway,
    ProjectorSettingsService,
    ProjectorService,
    MediaFilesService,
    WebRtcSignalingService],
  imports: [TypeOrmModule.forFeature([DisplayState, MediaFile, ProjectorSettings]), TextUnitResourcesModule]
})
export class ProjectorManagementModule { }
