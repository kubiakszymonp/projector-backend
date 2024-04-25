import { Module } from '@nestjs/common';
import { TextUnitTagService } from './text-unit-tag.service';
import { TextUnitTagController } from './text-unit-tag.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TextUnitTagController],
  providers: [TextUnitTagService],
  imports: [DatabaseModule],
})
export class TextUnitTagModule {}
