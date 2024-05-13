import { PartialType } from '@nestjs/swagger';
import { CreateTextUnitResourceDto } from './create-text-unit-resource.dto';

export class UpdateTextUnitResourceDto extends PartialType(CreateTextUnitResourceDto) {}
