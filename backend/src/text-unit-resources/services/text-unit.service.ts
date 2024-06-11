import { Get, Inject, Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { TextUnit } from '../entities/text-unit.entity';
import { CreateTextUnitDto } from '../dto/create/create-text-unit.dto';
import { UpdateTextUnitDto } from '../dto/update/update-text-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueTextUnit } from '../entities/queue-text-unit.entity';
import { QueueTextUnitService } from './queue-text-unit.service';
import { GetTextUnitDto } from '../dto/get/get-text-unit.dto';
import { GetQueueTextUnit } from '../dto/get/get-queue-text-unit.dto';
import { GetTextUnitTagDto } from '../dto/get/get-text-unit-tag.dto';


@Injectable()
export class TextUnitService {
  ;

  constructor(
    @InjectRepository(TextUnit) private textUnitRepository: Repository<TextUnit>,
    private queueTextUnitService: QueueTextUnitService,
  ) {
  }

  async create(organizationId: string, createTextUnitDto: CreateTextUnitDto) {
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

  async findAll(organizationId: string): Promise<GetTextUnitDto[]> {
    const results = await this.textUnitRepository.find({
      where: { organizationId },
      relations: ['tags', 'queueTextUnits', 'queueTextUnits.displayQueue', 'queueTextUnits.textUnit'],
      select: ['title', 'id', 'queueTextUnits', 'tags'],
      order: {
        updatedAt: 'DESC'
      }
    });

    return results.map((entity) => ({
      content: entity.content,
      description: entity.description,
      organizationId: entity.organizationId,
      title: entity.title,
      partsOrder: entity.partsOrder,
      id: entity.id,
      tags: (entity.tags ?? []).map(GetTextUnitTagDto.fromTextUnitTag),
      queues: (entity.queueTextUnits ?? []).map(GetQueueTextUnit.fromQueueTextUnit),
    }));
  }

  async findOne(id: string): Promise<GetTextUnitDto> {
    const entity = await this.textUnitRepository.findOne({
      where: { id },
      relations: ['tags', 'queueTextUnits', 'queueTextUnits.displayQueue', 'queueTextUnits.textUnit']
    });

    if (!entity) return null;

    return {
      content: entity.content,
      description: entity.description,
      organizationId: entity.organizationId,
      title: entity.title,
      id: entity.id,
      partsOrder: entity.partsOrder,
      tags: (entity.tags ?? []).map(GetTextUnitTagDto.fromTextUnitTag),
      queues: (entity.queueTextUnits ?? []).map(GetQueueTextUnit.fromQueueTextUnit),
    };
  }

  async update(id: string, updateTextUnitDto: UpdateTextUnitDto) {
    const textUnit = this.textUnitRepository.create({
      content: updateTextUnitDto.content,
      title: updateTextUnitDto.title,
      transposition: updateTextUnitDto.transposition,
      id,
      tags: updateTextUnitDto.textUnitTagIds.map((id) => ({ id })),
    });

    await this.queueTextUnitService.setTextUnitToQueues(id, updateTextUnitDto.displayQueueIds);
    await this.textUnitRepository.save(textUnit);

    return this.findOne(id);
  }

  remove(id: string) {
    return this.textUnitRepository.delete({ id });
  }
}
