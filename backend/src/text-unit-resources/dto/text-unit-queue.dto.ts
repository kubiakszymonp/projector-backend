import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/common/base-dto.dto';
import { TextUnitQueueContent } from '../entities/display-queue.entity';

export class TextUnitQueueDto extends BaseDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  content: TextUnitQueueContent;
}
