import { Injectable, NotFoundException } from '@nestjs/common';
import { DisplayState } from 'src/projector-management/entities/display-state.entity';
import { ProjectorLastUpdateService } from 'src/projector-management/projector-last-update.service';
import { Repository } from 'typeorm';
import { DisplayQueue } from '../entities/display-queue.entity';
import { CreateDisplayQueueDto } from '../dto/create/create-display-queue.dto';
import { UpdateDisplayQueueDto } from '../dto/update/update-display-queue.dto';
import { GetDisplayQueueDto } from '../dto/get/get-display-queue.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DisplayQueuesService {

  constructor(@InjectRepository(DisplayQueue) private displayQueueRepository: Repository<DisplayQueue>) { }

  create(createTextUnitQueue: CreateDisplayQueueDto, organizationId: number) {
    const textUnitQueue = this.displayQueueRepository.create({
      ...createTextUnitQueue,
      organizationId,
    });
    delete textUnitQueue.id;
    return this.displayQueueRepository.save(textUnitQueue);
  }

  async findAll(organizationId: number): Promise<GetDisplayQueueDto[]> {
    const displayQueues = await this.displayQueueRepository.find({
      where: { organizationId },
      order: { updatedAt: 'desc' },
      relations: ['queueTextUnits', 'queueTextUnits.textUnit']
    });

    return displayQueues.map((displayQueue) => {
      return {
        id: displayQueue.id,
        name: displayQueue.name,
        description: displayQueue.description,
        organizationId: displayQueue.organizationId,
        queueTextUnits: displayQueue.queueTextUnits.map((queueTextUnit) => {
          return {
            id: queueTextUnit.id,
            title: queueTextUnit.textUnit.title,
          };
        }),
      };
    });
  }



  async findOne(id: number): Promise<GetDisplayQueueDto> {
    const queue = await this.displayQueueRepository.findOne({
      where: { id },
      relations: ['queueTextUnits', 'queueTextUnits.textUnit']
    });

    return {
      id: queue.id,
      name: queue.name,
      description: queue.description,
      organizationId: queue.organizationId,
      queueTextUnits: queue.queueTextUnits.map((queueTextUnit) => {
        return {
          id: queueTextUnit.id,
          title: queueTextUnit.textUnit.title,
        };
      }),
    };
  }

  async update(id: number, updateTextUnitQueue: UpdateDisplayQueueDto) {
    const textUnitQueue =
      this.displayQueueRepository.create(updateTextUnitQueue);
    this.displayQueueRepository.update(id, textUnitQueue);
  }

  remove(id: number) {
    return this.displayQueueRepository.delete(id);
  }
}
