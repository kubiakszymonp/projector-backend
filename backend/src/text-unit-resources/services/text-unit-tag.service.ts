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

  constructor(@InjectRepository(TextUnitTag) private textUnitTagRepository: Repository<TextUnitTag>) {
  }

  async create(organizationId: string, createTextUnitTagDto: CreateTextUnitTagDto): Promise<GetTextUnitTagDto> {
    const newTag = this.textUnitTagRepository.create({
      description: createTextUnitTagDto.description,
      name: createTextUnitTagDto.name,
      organizationId,
    });
    const addedTag = await this.textUnitTagRepository.save(newTag);

    return this.findOne(addedTag.id);
  }

  async findAll(organizationId: string): Promise<GetTextUnitTagDto[]> {
    const allTagsForOrganization = await this.textUnitTagRepository.find({
      where: { organizationId },
    });

    return allTagsForOrganization.map(GetTextUnitTagDto.fromTextUnitTag);
  }

  async findOne(id: string): Promise<GetTextUnitTagDto> {
    const tag = await this.textUnitTagRepository.findOne({
      where: { id },
    });

    return GetTextUnitTagDto.fromTextUnitTag(tag);
  }

  async remove(id: string) {
    const deleteResult = await this.textUnitTagRepository.delete({ id });

    return deleteResult;
  }

  async update(id: string, updateTextUnitTagDto: UpdateTextUnitTagDto): Promise<GetTextUnitTagDto> {
    const tag = this.textUnitTagRepository.create(updateTextUnitTagDto);
    await this.textUnitTagRepository.save({ id, ...tag });

    return await this.findOne(id);
  }
}
