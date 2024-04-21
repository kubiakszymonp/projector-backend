import { Module } from '@nestjs/common';
import { TextUnitQueuesService } from './text-unit-queues.service';
import { TextUnitQueuesController } from './text-unit-queues.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TextUnitQueuesController],
  providers: [TextUnitQueuesService],
  imports: [DatabaseModule],
})
export class TextUnitQueuesModule {}
