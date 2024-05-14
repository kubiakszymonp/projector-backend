import { Injectable } from '@nestjs/common';
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

export const RELATIVE_PATH = '../../../songs';
export const FILE_EXTENSION = '.txt';

@Injectable()
export class TextUnitService {
  ;

  constructor(
    @InjectRepository(TextUnit) private textUnitRepository: Repository<TextUnit>
  ) {
  }

  async create(organizationId: number, createTextUnitDto: CreateTextUnitDto) {
    const result = await this.textUnitRepository.save({
      content: createTextUnitDto.content,
      title: createTextUnitDto.title,
      organizationId,
      tags: createTextUnitDto.textUnitTagIds.map((id) => ({ id })),
      queueTextUnits: createTextUnitDto.displayQueueIds.map((id) => ({ id })),
    });

    return result;
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

  // async getCurrentTextUnit(organizationId: number) {
  //   const projectorState = await this.displayStateRepository.findOne({
  //     where: { organizationId },
  //   });

  //   if (!projectorState) {
  //     throw new Error('No projector state found');
  //   }

  //   return this.textUnitRepository.findOne({
  //     where: { id: projectorState.textState.textUnitId },
  //   });
  // }

  // async setCurrentTextUnit(textUnitId: number, organizationId: number) {
  //   const displayState = await this.displayStateRepository.findOne({
  //     where: { organizationId },
  //   });

  //   if (!displayState) {
  //     throw new Error('No display state found');
  //   }

  //   displayState.textState.textUnitId = textUnitId;
  //   displayState.textState.textUnitPart = 0;
  //   displayState.textState.textUnitPartPage = 0;
  //   displayState.displayType = DisplayType.TEXT;

  //   const updated = this.displayStateRepository.create(displayState);

  //   await this.displayStateRepository.save(updated);
  //   this.projectorLastUpdateService.setLastUpdate(organizationId);
  // }

  // async loadTextUnitsFromDisc() {
  //   const textUnits: { title: string; content: string }[] = [];
  //   const dir = path.join(__dirname, RELATIVE_PATH);
  //   const files = fs.readdirSync(dir);
  //   for (const file of files) {
  //     if (file.endsWith(FILE_EXTENSION)) {
  //       const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  //       textUnits.push({ title: file.replace(FILE_EXTENSION, ''), content });
  //     }
  //   }
  //   await this.textUnitRepository.insert(textUnits);
  // }
}
