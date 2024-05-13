import { PartialType } from '@nestjs/swagger';
import { CreateProjectorManagementDto } from './create-projector-management.dto';

export class UpdateProjectorManagementDto extends PartialType(CreateProjectorManagementDto) {}
