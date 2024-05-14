import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { DisplayStateModule } from './display-state/display-state.module';
import { TextUnitModule } from './text-unit/text-unit.module';
import { ProjectorSettingsModule } from './projector-settings/projector-settings.module';
import { ProjectorModule } from './projector/projector.module';
import { UploadedFilesModule } from './uploaded-files/uploaded-files.module';
import { TextUnitQueuesModule } from './text-unit-queues/text-unit-queues.module';
import { TextUnitTagModule } from './text-unit-tag/text-unit-tag.module';
import { LiveStreamingModule } from './live-streaming/live-streaming.module';
import { OrganizationAuthModule } from './organization-auth/organization-auth.module';
import { TextUnitResourcesModule } from './text-unit-resources/text-unit-resources.module';
import { ProjectorManagementModule } from './projector-management/projector-management.module';
import { ConfigModule } from '@nestjs/config';
import { Type } from 'class-transformer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // relative path to the database file
      database: environment.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: environment.DATABASE_SYNCHRONIZE,
      logging: environment.DATABASE_LOGGING,
      dropSchema: environment.DROP_SCHEMA,
    })
    // OrganizationsModule,
    // DisplayStateModule,
    // TextUnitModule,
    // TextUnitQueuesModule,
    // ProjectorSettingsModule,
    // ProjectorModule,
    // UploadedFilesModule,
    // TextUnitTagModule,
    // LiveStreamingModule,
    OrganizationAuthModule,
    // TextUnitResourcesModule,
    // ProjectorManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
