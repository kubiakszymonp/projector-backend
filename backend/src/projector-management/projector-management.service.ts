import { Injectable } from '@nestjs/common';
import { CreateProjectorManagementDto } from './dto/create-projector-management.dto';
import { UpdateProjectorManagementDto } from './dto/update-projector-management.dto';

@Injectable()
export class ProjectorManagementService {
  create(createProjectorManagementDto: CreateProjectorManagementDto) {
    return 'This action adds a new projectorManagement';
  }

  findAll() {
    return `This action returns all projectorManagement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectorManagement`;
  }

  update(id: number, updateProjectorManagementDto: UpdateProjectorManagementDto) {
    return `This action updates a #${id} projectorManagement`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectorManagement`;
  }
}
