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
import { MediaFilesController } from './controllers/media-files.controller';
import { WebRtcController } from './controllers/webrtc-signaling.controller';

@Module({
  controllers: [DisplayStateController, ProjectorSettingsController, ProjectorController, MediaFilesController, WebRtcController],
  providers: [DisplayStateService,
    ProjectorChangeNotificationGateway,
    ProjectorSettingsService,
    ProjectorService,
    MediaFilesService,
    WebRtcSignalingService],
  imports: [TypeOrmModule.forFeature([DisplayState, MediaFile, ProjectorSettings]), TextUnitResourcesModule]
})
export class ProjectorManagementModule {

  constructor(private displayStateService: DisplayStateService,
    private projectorSettingsService: ProjectorSettingsService,
    private projectorService: ProjectorService,
    private mediaFilesService: MediaFilesService,
    private webRtcSignalingService: WebRtcSignalingService
  ) {
    this.seed(displayStateService, projectorSettingsService, projectorService, mediaFilesService, webRtcSignalingService);
  }

  async seed(displayStateService: DisplayStateService,
    projectorSettingsService: ProjectorSettingsService,
    projectorService: ProjectorService,
    mediaFilesService: MediaFilesService,
    webRtcSignalingService: WebRtcSignalingService) {

      await displayStateService.create(1);
      await projectorSettingsService.create(1);
  }

}
