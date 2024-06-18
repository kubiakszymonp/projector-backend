import { Module } from '@nestjs/common';
import { DisplayQueuesController } from './controllers/display-queues.controller';
import { TextUnitTagController } from './controllers/text-unit-tag.controller';
import { TextUnitController } from './controllers/text-unit.controller';
import { DisplayQueuesService } from './services/display-queues.service';
import { TextUnitTagService } from './services/text-unit-tag.service';
import { TextUnitService } from './services/text-unit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisplayQueue } from './entities/display-queue.entity';
import { QueueTextUnit } from './entities/queue-text-unit.entity';
import { TextUnitTag } from './entities/text-unit-tag.entity';
import { TextUnit } from './entities/text-unit.entity';
import { ENVIRONMENT } from 'src/environment';
import { seedTextUnits } from './seeding/seeding';
import { QueueTextUnitService } from './services/queue-text-unit.service';
import { User } from 'src/organization-auth/entities/user.entity';
import { BackupController } from './controllers/backup.controller';
import { BackupService } from './services/backup.service';


@Module({
  controllers: [DisplayQueuesController, TextUnitTagController, TextUnitController, BackupController],
  providers: [DisplayQueuesService, TextUnitTagService, TextUnitService, QueueTextUnitService, BackupService],
  imports: [TypeOrmModule.forFeature([DisplayQueue, QueueTextUnit, TextUnitTag, TextUnit, User])],
  exports: [TextUnitService, DisplayQueuesService, QueueTextUnitService]
})
export class TextUnitResourcesModule {
  constructor(
    private displayQueuesService: DisplayQueuesService,
    private textUnitTagService: TextUnitTagService,
    private textUnitService: TextUnitService) {
  }
}
