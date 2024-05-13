import { Module } from '@nestjs/common';
import { ProjectorManagementService } from './projector-management.service';
import { ProjectorManagementController } from './projector-management.controller';

@Module({
  controllers: [ProjectorManagementController],
  providers: [ProjectorManagementService],
})
export class ProjectorManagementModule {}
