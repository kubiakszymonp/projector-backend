import { Inject, Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { TextUnit } from '../entities/text-unit.entity';
import { CreateTextUnitDto } from '../dto/create/create-text-unit.dto';
import { UpdateTextUnitDto } from '../dto/update/update-text-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueTextUnit } from '../entities/queue-text-unit.entity';
import { QueueTextUnitService } from './queue-text-unit.service';
import { GetTextUnitDto } from '../dto/get/get-text-unit.dto';


@Injectable()
export class TextUnitService {
  ;

  constructor(
    @InjectRepository(TextUnit) private textUnitRepository: Repository<TextUnit>,
    private queueTextUnitService: QueueTextUnitService,
  ) {
  }

  async create(organizationId: number, createTextUnitDto: CreateTextUnitDto) {
    const textUnit = await this.textUnitRepository.save({
      content: createTextUnitDto.content,
      title: createTextUnitDto.title,
      organizationId,
      tags: createTextUnitDto.textUnitTagIds.map((id) => ({ id })),
      transposition: createTextUnitDto.transposition,
      description: createTextUnitDto.description,
    });

    await this.queueTextUnitService.setTextUnitToQueues(textUnit.id, createTextUnitDto.displayQueueIds);

    return textUnit;
  }

  async findAll(organizationId: number) {
    const query = this.textUnitRepository.createQueryBuilder('textUnit')
      .leftJoinAndSelect('textUnit.tags', 'tags')
      .leftJoinAndSelect('textUnit.queueTextUnits', 'queueTextUnits')
      .leftJoinAndSelect('queueTextUnits.displayQueue', 'displayQueue')
      .where('textUnit.organizationId = :organizationId', { organizationId })
      .orWhere('textUnit.organizationId IS NULL')
      .orderBy('textUnit.updatedAt', 'DESC');

    const result = await query.getMany();
    return result;
  }

  async findOne(id: number): Promise<GetTextUnitDto> {
    const query = this.textUnitRepository.createQueryBuilder('textUnit')
    .leftJoinAndSelect('textUnit.tags', 'tags')
    .leftJoinAndSelect('textUnit.queueTextUnits', 'queueTextUnits')
    .leftJoinAndSelect('queueTextUnits.displayQueue', 'displayQueue')
    .where('textUnit.id = :id', { id });

  const entity = await query.getOne();

  if (!entity) {
    throw new Error(`Text unit with id ${id} not found`);
  }

  return {
    content: entity.content,
    description: entity.description,
    organizationId: entity.organizationId,
    title: entity.title,
    id: entity.id,
    tags: (entity.tags ?? []).map((tag) => ({
      id: tag.id,
      name: tag.name,
    })),
    queues: (entity.queueTextUnits ?? []).map((queueTextUnit) => ({
      id: queueTextUnit.displayQueue.id,
      title: queueTextUnit.displayQueue.name,
    })),
  };
  }

  async update(id: number, updateTextUnitDto: UpdateTextUnitDto) {

    const textUnit = this.textUnitRepository.create({
      content: updateTextUnitDto.content,
      title: updateTextUnitDto.title,
      transposition: updateTextUnitDto.transposition,
      id,
      tags: updateTextUnitDto.textUnitTagIds.map((id) => ({ id })),
    });

    await this.queueTextUnitService.setTextUnitToQueues(id, updateTextUnitDto.displayQueueIds);

    return await this.textUnitRepository.save(textUnit);
  }

  remove(id: number) {
    return this.textUnitRepository.delete({ id });
  }
}
