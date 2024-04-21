import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BaseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty()
  @IsOptional()
  updatedAt?: Date;
}
