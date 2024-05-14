import { Injectable, NotFoundException } from '@nestjs/common';
import { DisplayState } from 'src/projector-management/entities/display-state.entity';
import { ProjectorLastUpdateService } from 'src/projector-management/projector-last-update.service';
import { Repository } from 'typeorm';
import { TextUnitQueueDto } from './dto/text-unit-queue.dto';
import { DisplayQueue } from './entities/display-queue.entity';

@Injectable()
export class TextUnitQueuesService {


  constructor(private textUnitQueueRepository: Repository<DisplayQueue>,
    private displayStateRepository: Repository<DisplayState>,
    private projectorLastUpdateService: ProjectorLastUpdateService) {
  }

  create(createTextUnitQueue: TextUnitQueueDto, organizationId: number) {
    const textUnitQueue = this.textUnitQueueRepository.create({
      ...createTextUnitQueue,
      organizationId,
    });
    delete textUnitQueue.id;
    return this.textUnitQueueRepository.save(textUnitQueue);
  }

  findAll(organizationId: number) {
    return this.textUnitQueueRepository.find({
      where: { organizationId },
      order: { updatedAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.textUnitQueueRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateTextUnitQueue: TextUnitQueueDto) {
    const textUnitQueue =
      this.textUnitQueueRepository.create(updateTextUnitQueue);
    this.textUnitQueueRepository.update(id, textUnitQueue);
  }

  remove(id: number) {
    return this.textUnitQueueRepository.delete(id);
  }
}
