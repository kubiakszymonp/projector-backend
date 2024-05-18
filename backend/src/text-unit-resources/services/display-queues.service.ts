import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DisplayQueue } from '../entities/display-queue.entity';
import { CreateDisplayQueueDto } from '../dto/create/create-display-queue.dto';
import { UpdateDisplayQueueDto } from '../dto/update/update-display-queue.dto';
import { GetDisplayQueueDto } from '../dto/get/get-display-queue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueTextUnit } from '../entities/queue-text-unit.entity';

@Injectable()
export class DisplayQueuesService {

  constructor(
    @InjectRepository(DisplayQueue) private displayQueueRepository: Repository<DisplayQueue>,
    @InjectRepository(QueueTextUnit) private queueTextUnitRepository: Repository<QueueTextUnit>,
  ) { }

  async create(organizationId: number, createTextUnitQueue: CreateDisplayQueueDto) {

    const textUnitQueue = this.displayQueueRepository.create({
      name: createTextUnitQueue.name,
      description: createTextUnitQueue.description,
      organizationId,
    });

    const displayQueue = await this.displayQueueRepository.save(textUnitQueue);

    const queueTextUnits = createTextUnitQueue.textUnitIds.map((id, index) => this.queueTextUnitRepository.create({
      displayQueue: { id: displayQueue.id },
      textUnit: { id },
      position: index,
    }));
    await this.queueTextUnitRepository.save(queueTextUnits);
    
    return displayQueue;
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
            position: queueTextUnit.position,
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
          position: queueTextUnit.position,
        };
      }),
    };
  }

  async update(id: number, updateTextUnitQueue: UpdateDisplayQueueDto) {

    const textUnitQueue = this.displayQueueRepository.create({
      name: updateTextUnitQueue.name,
      description: updateTextUnitQueue.description,
      queueTextUnits: updateTextUnitQueue.textUnitIds.map((id) => ({ id })),
    });

    const displayQueue = await this.displayQueueRepository.update(id, textUnitQueue);

    await this.queueTextUnitRepository.delete({
      displayQueue: { id },
    });

    const queueTextUnits = updateTextUnitQueue.textUnitIds.map((id, index) => this.queueTextUnitRepository.create({
      displayQueue: { id: id },
      textUnit: { id },
      position: index,
    }));

    await this.queueTextUnitRepository.save(queueTextUnits);

    return displayQueue;
  }

  remove(id: number) {
    return this.displayQueueRepository.delete(id);
  }
}
