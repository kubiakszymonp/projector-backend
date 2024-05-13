import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectorManagementService } from './projector-management.service';
import { CreateProjectorManagementDto } from './dto/create-projector-management.dto';
import { UpdateProjectorManagementDto } from './dto/update-projector-management.dto';

@Controller('projector-management')
export class ProjectorManagementController {
  constructor(private readonly projectorManagementService: ProjectorManagementService) {}

  @Post()
  create(@Body() createProjectorManagementDto: CreateProjectorManagementDto) {
    return this.projectorManagementService.create(createProjectorManagementDto);
  }

  @Get()
  findAll() {
    return this.projectorManagementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectorManagementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectorManagementDto: UpdateProjectorManagementDto) {
    return this.projectorManagementService.update(+id, updateProjectorManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectorManagementService.remove(+id);
  }
}
