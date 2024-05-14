import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationAuthModule } from './organization-auth/organization-auth.module';
import { TextUnitResourcesModule } from './text-unit-resources/text-unit-resources.module';
import { ProjectorManagementModule } from './projector-management/projector-management.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENVIRONMENT } from './environment';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // relative path to the database file
      database: ENVIRONMENT.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: ENVIRONMENT.DATABASE_SYNCHRONIZE,
      logging: ENVIRONMENT.DATABASE_LOGGING,
      dropSchema: ENVIRONMENT.DROP_SCHEMA,
    }),
    OrganizationAuthModule,
    TextUnitResourcesModule,
    ProjectorManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
