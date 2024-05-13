import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TextUnitResourcesService } from './text-unit-resources.service';
import { CreateTextUnitResourceDto } from './dto/create-text-unit-resource.dto';
import { UpdateTextUnitResourceDto } from './dto/update-text-unit-resource.dto';

@Controller('text-unit-resources')
export class TextUnitResourcesController {
  constructor(private readonly textUnitResourcesService: TextUnitResourcesService) {}

  @Post()
  create(@Body() createTextUnitResourceDto: CreateTextUnitResourceDto) {
    return this.textUnitResourcesService.create(createTextUnitResourceDto);
  }

  @Get()
  findAll() {
    return this.textUnitResourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.textUnitResourcesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTextUnitResourceDto: UpdateTextUnitResourceDto) {
    return this.textUnitResourcesService.update(+id, updateTextUnitResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textUnitResourcesService.remove(+id);
  }
}
