import { Module } from '@nestjs/common';
import { OrganizationAuthModule } from './organization-auth/organization-auth.module';
import { TextUnitResourcesModule } from './text-unit-resources/text-unit-resources.module';
import { ProjectorManagementModule } from './projector-management/projector-management.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENVIRONMENT } from './environment';
import { User } from './organization-auth/entities/user.entity';
import { Organization } from './organization-auth/entities/organization.entity';
import { TextUnit } from './text-unit-resources/entities/text-unit.entity';
import { DisplayQueue } from './text-unit-resources/entities/display-queue.entity';
import { TextUnitTag } from './text-unit-resources/entities/text-unit-tag.entity';
import { QueueTextUnit } from './text-unit-resources/entities/queue-text-unit.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // relative path to the database file
      database: ENVIRONMENT.DATABASE_URL,
      entities: [User, Organization, TextUnit, DisplayQueue, TextUnitTag, QueueTextUnit],
      synchronize: ENVIRONMENT.DATABASE_SYNCHRONIZE,
      logging: ENVIRONMENT.DATABASE_LOGGING,
      dropSchema: ENVIRONMENT.DROP_SCHEMA,
    }),
    ENVIRONMENT.LOAD_ORGANIZATION_MODULE ? OrganizationAuthModule : null,
    ENVIRONMENT.LOAD_TEXTS_MODULE ? TextUnitResourcesModule : null,
    ENVIRONMENT.LOAD_PROJECTOR_MODULE ? ProjectorManagementModule : null,
  ],
})
export class AppModule { }
