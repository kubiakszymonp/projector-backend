import { Injectable, NotFoundException } from '@nestjs/common';
import { DisplayState } from 'src/projector-management/entities/display-state.entity';
import { ProjectorLastUpdateService } from 'src/projector-management/projector-last-update.service';
import { Repository } from 'typeorm';
import { TextUnitQueueDto } from './dto/text-unit-queue.dto';
import { TextUnitQueue } from './entities/text-unit-queue.entity';

@Injectable()
export class TextUnitQueuesService {


  constructor(private textUnitQueueRepository: Repository<TextUnitQueue>,
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

  async getCurrentTextUnitQueue(organizationId: number) {
    const projectorState = await this.displayStateRepository.findOne({
      where: { organizationId },
      relations: { textUnitQueue: true },
    });

    if (!projectorState) {
      throw new NotFoundException('No projector state found');
    }

    const textUnitQueue = await this.textUnitQueueRepository.findOne({
      where: { id: projectorState?.textUnitQueue?.id },
    });

    return textUnitQueue;
  }

  async setCurrentTextUnitQueue(
    organizationId: number,
    textUnitQueueId: number,
  ) {
    const projectorState = await this.displayStateRepository.findOne({
      where: { organizationId },
    });

    if (!projectorState) {
      throw new NotFoundException('No projector state found');
    }

    const textUnitQueue = await this.textUnitQueueRepository.findOne({
      where: { id: textUnitQueueId },
    });

    if (!textUnitQueue) {
      throw new NotFoundException('No text unit queue found');
    }

    projectorState.textUnitQueue = textUnitQueue;

    const newProjectorState =
      this.displayStateRepository.create(projectorState);

    await this.displayStateRepository.update(projectorState.id, newProjectorState);
    this.projectorLastUpdateService.setLastUpdate(organizationId);
  }
}
