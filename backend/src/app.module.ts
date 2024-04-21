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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
