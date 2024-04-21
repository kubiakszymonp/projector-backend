import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/common/base-dto.dto';

export class TextUnitDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  content: string;
  @ApiProperty()
  @IsNotEmpty()
  title: string;
}
