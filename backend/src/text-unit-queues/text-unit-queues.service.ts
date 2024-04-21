import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryFactory } from 'src/database/repository.factory';
import { Repository } from 'typeorm';
import { DisplayState } from 'src/database/entities/display-state.entity';
import { TextUnitQueue } from 'src/database/entities/text-unit-queue.entity';
import { TextUnitQueueDto } from './dto/text-unit-queue.dto';

@Injectable()
export class TextUnitQueuesService {
  private textUnitQueueRepository: Repository<TextUnitQueue>;
  private displayStateRepository: Repository<DisplayState>;

  constructor(repositoryFactory: RepositoryFactory) {
    this.textUnitQueueRepository =
      repositoryFactory.getRepository(TextUnitQueue);
    this.displayStateRepository = repositoryFactory.getRepository(DisplayState);
  }

  create(createTextUnitQueue: TextUnitQueueDto, organizationId: number) {
    const textUnitQueue = this.textUnitQueueRepository.create({
      ...createTextUnitQueue,
      organization: { id: organizationId },
    });
    delete textUnitQueue.id;
    return this.textUnitQueueRepository.save(textUnitQueue);
  }

  findAll(organizationId: number) {
    return this.textUnitQueueRepository.find({
      where: { organization: { id: organizationId } },
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
      where: { organization: { id: organizationId } },
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
      where: { organization: { id: organizationId } },
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

    this.displayStateRepository.update(projectorState.id, newProjectorState);
  }
}
