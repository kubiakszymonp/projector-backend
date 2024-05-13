import { Injectable } from '@nestjs/common';
import { CreateTextUnitResourceDto } from './dto/create-text-unit-resource.dto';
import { UpdateTextUnitResourceDto } from './dto/update-text-unit-resource.dto';

@Injectable()
export class TextUnitResourcesService {
  create(createTextUnitResourceDto: CreateTextUnitResourceDto) {
    return 'This action adds a new textUnitResource';
  }

  findAll() {
    return `This action returns all textUnitResources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} textUnitResource`;
  }

  update(id: number, updateTextUnitResourceDto: UpdateTextUnitResourceDto) {
    return `This action updates a #${id} textUnitResource`;
  }

  remove(id: number) {
    return `This action removes a #${id} textUnitResource`;
  }
}
