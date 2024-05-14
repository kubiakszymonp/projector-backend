import { Module } from '@nestjs/common';
import { UploadedFilesService } from './uploaded-files.service';
import { UploadedFilesController } from './uploaded-files.controller';
import { ProjectorModule } from 'src/projector/projector.module';

@Module({
  controllers: [UploadedFilesController],
  providers: [UploadedFilesService],
  imports: [ ProjectorModule],
})
export class UploadedFilesModule {}
