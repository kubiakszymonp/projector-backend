import { Module } from '@nestjs/common';
import { TextUnitService } from './text-unit.service';
import { DatabaseModule } from 'src/database/database.module';
import { TextUnitController } from './text-unit.controller';
import { ProjectorModule } from 'src/projector/projector.module';

@Module({
  controllers: [TextUnitController],
  providers: [TextUnitService],
  imports: [DatabaseModule, ProjectorModule],
})
export class TextUnitModule {}
