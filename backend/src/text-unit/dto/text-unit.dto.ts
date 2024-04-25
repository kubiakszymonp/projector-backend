import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/common/base-dto.dto';
import { TextUnitTagDto } from 'src/text-unit-tag/dto/text-unit-tag.dto';

export class TextUnitDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  tags: TextUnitTagDto[];
}
