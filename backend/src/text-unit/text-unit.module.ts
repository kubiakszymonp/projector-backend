import { Module } from '@nestjs/common';
import { TextUnitService } from './text-unit.service';
import { DatabaseModule } from 'src/database/database.module';
import { TextUnitController } from './text-unit.controller';

@Module({
  controllers: [TextUnitController],
  providers: [TextUnitService],
  imports: [DatabaseModule],
})
export class TextUnitModule {}
