import { Inject, Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DisplayType } from 'src/projector-management/enums/display-type.enum';
import { DisplayState } from 'src/projector-management/entities/display-state.entity';
import { ProjectorLastUpdateService } from 'src/projector-management/projector-last-update.service';
import { TextUnit } from '../entities/text-unit.entity';
import { CreateTextUnitDto } from '../dto/create/create-text-unit.dto';
import { UpdateTextUnitDto } from '../dto/update/update-text-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueTextUnit } from '../entities/queue-text-unit.entity';

export const RELATIVE_PATH = '../../../songs';
export const FILE_EXTENSION = '.txt';

@Injectable()
export class TextUnitService {
  ;

  constructor(
    @InjectRepository(TextUnit) private textUnitRepository: Repository<TextUnit>
    @InjectRepository(QueueTextUnit) private queueTextUnitRepository: Repository<QueueTextUnit>,
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

    const queueTextUnits = createTextUnitDto.displayQueueIds.map((id, index) => this.queueTextUnitRepository.create({
      displayQueue: { id },
      textUnit: { id: textUnit.id },
      position: index,
    }));
    await this.queueTextUnitRepository.save(queueTextUnits);

    return textUnit;
  }

  async findAll(organizationId: number) {
    const result = await this.textUnitRepository.find({
      where: [
        { organizationId },
        { organizationId: IsNull() },
      ],
      order: { updatedAt: 'desc' },
      relations: ['tags'],
    });
    return result;
  }

  findOne(id: number) {
    return this.textUnitRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
  }

  async update(id: number, updateTextUnitDto: UpdateTextUnitDto) {

    const textUnit = this.textUnitRepository.create({
      content: updateTextUnitDto.content,
      title: updateTextUnitDto.title,
      transposition: updateTextUnitDto.transposition,
      id,
      queueTextUnits: updateTextUnitDto.displayQueueIds.map((id) => ({ id })),
      tags: updateTextUnitDto.textUnitTagIds.map((id) => ({ id })),
    });

    return await this.textUnitRepository.save(textUnit);
  }

  remove(id: number) {
    return this.textUnitRepository.delete({ id });
  }
}
