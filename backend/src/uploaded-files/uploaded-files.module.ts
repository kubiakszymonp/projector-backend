import { Module } from '@nestjs/common';
import { UploadedFilesService } from './uploaded-files.service';
import { UploadedFilesController } from './uploaded-files.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [UploadedFilesController],
  providers: [UploadedFilesService],
  imports: [DatabaseModule],
})
export class UploadedFilesModule {}
