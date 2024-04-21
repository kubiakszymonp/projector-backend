import { Module } from '@nestjs/common';
import { ProjectorService } from './projector.service';
import { ProjectorController } from './projector.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProjectorController],
  providers: [ProjectorService],
  imports: [DatabaseModule],
})
export class ProjectorModule {}
