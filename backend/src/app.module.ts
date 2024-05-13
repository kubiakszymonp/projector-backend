import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AuthModule } from './auth/auth.module';
import { DisplayStateModule } from './display-state/display-state.module';
import { TextUnitModule } from './text-unit/text-unit.module';
import { ProjectorSettingsModule } from './projector-settings/projector-settings.module';
import { ProjectorModule } from './projector/projector.module';
import { UploadedFilesModule } from './uploaded-files/uploaded-files.module';
import { TextUnitQueue } from './database/entities/text-unit-queue.entity';
import { TextUnitQueuesModule } from './text-unit-queues/text-unit-queues.module';
import { TextUnitTagModule } from './text-unit-tag/text-unit-tag.module';
import { LiveStreamingModule } from './live-streaming/live-streaming.module';
import { OrganizationAuthResolver } from './organization-auth/organization-auth.resolver';
import { TextUnitResourcesResolver } from './text-unit-resources/text-unit-resources.resolver';
import { ProjectorManagementResolver } from './projector-management/projector-management.resolver';
import { OrganizationAuthModule } from './organization-auth/organization-auth.module';
import { TextUnitResourcesModule } from './text-unit-resources/text-unit-resources.module';
import { ProjectorManagementModule } from './projector-management/projector-management.module';

@Module({
  imports: [
    DatabaseModule,
    OrganizationsModule,
    AuthModule,
    DisplayStateModule,
    TextUnitModule,
    TextUnitQueuesModule,
    ProjectorSettingsModule,
    ProjectorModule,
    UploadedFilesModule,
    TextUnitTagModule,
    LiveStreamingModule,
    OrganizationAuthModule,
    TextUnitResourcesModule,
    ProjectorManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService, OrganizationAuthResolver, TextUnitResourcesResolver, ProjectorManagementResolver],
})
export class AppModule {}
