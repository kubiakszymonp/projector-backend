import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { RepositoryFactory } from 'src/database/repository.factory';
import { TextUnitDto } from './dto/text-unit.dto';
import { DisplayState } from 'src/database/entities/display-state.entity';
import * as fs from 'fs';
import * as path from 'path';
import { TextUnit } from 'src/database/entities/text-unit.entity';

export const RELATIVE_PATH = '../../../songs';
export const FILE_EXTENSION = '.txt';

@Injectable()
export class TextUnitService {
  private textUnitRepository: Repository<TextUnit>;
  private displayStateRepository: Repository<DisplayState>;

  constructor(repoFactory: RepositoryFactory) {
    this.textUnitRepository = repoFactory.getRepository(TextUnit);
    this.displayStateRepository = repoFactory.getRepository(DisplayState);
  }

  async create(organizationId: number, createTextUnitDto: TextUnitDto) {
    await this.textUnitRepository.save({
      content: createTextUnitDto.content,
      title: createTextUnitDto.title,
      organization: { id: organizationId },
    });
  }

  async findAll(organizationId: number) {
    const result = await this.textUnitRepository.find({
      where: [
        { organization: { id: organizationId } },
        { organization: { id: IsNull() } },
      ],
      order: { updatedAt: 'desc' },
    });
    return result;
  }

  findOne(id: number) {
    return this.textUnitRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateTextUnitDto: TextUnitDto) {
    const textUnit = this.textUnitRepository.create(updateTextUnitDto);
    return this.textUnitRepository.update({ id }, textUnit);
  }

  remove(id: number) {
    return this.textUnitRepository.delete({ id });
  }

  async getCurrentTextUnit(organizationId: number) {
    const projectorState = await this.displayStateRepository.findOne({
      where: { organization: { id: organizationId } },
    });

    if (!projectorState) {
      throw new Error('No projector state found');
    }

    return this.textUnitRepository.findOne({
      where: { id: projectorState.textState.textUnitId },
    });
  }

  async setCurrentTextUnit(textUnitId: number, organizationId: number) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organization: { id: organizationId } },
    });

    if (!displayState) {
      throw new Error('No display state found');
    }

    displayState.textState.textUnitId = textUnitId;
    displayState.textState.textUnitPart = 0;
    displayState.textState.textUnitPartPage = 0;

    const updated = this.displayStateRepository.create(displayState);

    return this.displayStateRepository.save(updated);
  }

  async loadTextUnitsFromDisc() {
    const textUnits: { title: string; content: string }[] = [];
    const dir = path.join(__dirname, RELATIVE_PATH);
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith(FILE_EXTENSION)) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        textUnits.push({ title: file.replace(FILE_EXTENSION, ''), content });
      }
    }
    await this.textUnitRepository.insert(textUnits);
  }
}
