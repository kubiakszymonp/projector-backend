import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TextUnitTag } from '../entities/text-unit-tag.entity';
import { UpdateTextUnitDto } from '../dto/update/update-text-unit.dto';
import { CreateTextUnitTagDto } from '../dto/create/create-text-unit-tag.dto';
import { UpdateTextUnitTagDto } from '../dto/update/update-text-unit-tag.dto';
import { GetTextUnitDto } from '../dto/get/get-text-unit.dto';
import { GetTextUnitTagDto } from '../dto/get/get-text-unit-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TextUnitTagService {

  constructor( @InjectRepository(TextUnitTag)  private textUnitTagRepository: Repository<TextUnitTag>) {
  }

  async create(createTextUnitTagDto: CreateTextUnitTagDto, organizationId: number) {
    const newTag = this.textUnitTagRepository.create({
      description: createTextUnitTagDto.description,
      name: createTextUnitTagDto.name,
      organizationId,
    });
    await this.textUnitTagRepository.save(newTag);
    return newTag;
  }

  async findAll(organizationId: number): Promise<GetTextUnitTagDto[]> {
    const allTagsForOrganization = await this.textUnitTagRepository.find({
      where: { organizationId },
    });
    return allTagsForOrganization;
  }

  async findOne(id: number): Promise<GetTextUnitTagDto> {
    const tag = await this.textUnitTagRepository.findOne({
      where: { id },
    });
    return tag;
  }

  async remove(id: number) {
    const deleteResult = await this.textUnitTagRepository.delete({ id });
    return deleteResult;
  }

  async update(id: number, updateTextUnitTagDto: UpdateTextUnitTagDto) {
    const tag = this.textUnitTagRepository.create(updateTextUnitTagDto);
    await this.textUnitTagRepository.save({ id, ...tag });
    return tag;
  }
}
