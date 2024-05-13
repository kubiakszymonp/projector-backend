import { Module } from '@nestjs/common';
import { TextUnitResourcesService } from './text-unit-resources.service';
import { TextUnitResourcesController } from './text-unit-resources.controller';

@Module({
  controllers: [TextUnitResourcesController],
  providers: [TextUnitResourcesService],
})
export class TextUnitResourcesModule {}
