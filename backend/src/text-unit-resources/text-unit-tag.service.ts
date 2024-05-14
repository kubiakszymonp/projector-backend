import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TextUnitTagDto } from './dto/text-unit-tag.dto';
import { TextUnitTag } from './entities/text-unit-tag.entity';

@Injectable()
export class TextUnitTagService {

  constructor(private textUnitTagRepository: Repository<TextUnitTag>) {
  }

  async create(createTextUnitTagDto: TextUnitTagDto, organizationId: number) {
    const newTag = this.textUnitTagRepository.create({
      description: createTextUnitTagDto.description,
      name: createTextUnitTagDto.name,
      organizationId,
    });
    await this.textUnitTagRepository.save(newTag);
    return newTag;
  }

  async findAll(organizationId: number) {
    const allTagsForOrganization = await this.textUnitTagRepository.find({
      where: { organizationId },
    });
    return allTagsForOrganization;
  }

  async findOne(id: number) {
    const tag = await this.textUnitTagRepository.findOne({
      where: { id },
    });
    return tag;
  }

  async remove(id: number) {
    const deleteResult = await this.textUnitTagRepository.delete({ id });
    return deleteResult;
  }

  async update(id: number, updateTextUnitTagDto: TextUnitTagDto) {
    const tag = this.textUnitTagRepository.create(updateTextUnitTagDto);
    await this.textUnitTagRepository.save({ id, ...tag });
    return tag;
  }
}
