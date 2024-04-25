import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RepositoryFactory } from 'src/database/repository.factory';
import { TextUnitTagDto } from './dto/text-unit-tag.dto';
import { TextUnitTag } from 'src/database/entities/text-unit-tag.entity';

@Injectable()
export class TextUnitTagService {
  private textUnitTagRepository: Repository<TextUnitTag>;

  constructor(repoFactory: RepositoryFactory) {
    this.textUnitTagRepository = repoFactory.getRepository(TextUnitTag);
  }

  async create(createTextUnitTagDto: TextUnitTagDto, organizationId: number) {
    const newTag = this.textUnitTagRepository.create({
      description: createTextUnitTagDto.description,
      name: createTextUnitTagDto.name,
      organization: { id: organizationId },
    });
    await this.textUnitTagRepository.save(newTag);
    return newTag;
  }

  async findAll(organizationId: number) {
    const allTagsForOrganization = await this.textUnitTagRepository.find({
      where: { organization: { id: organizationId } },
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
