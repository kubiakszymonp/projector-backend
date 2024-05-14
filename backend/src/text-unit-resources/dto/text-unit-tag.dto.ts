import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base-dto.dto';

export class TextUnitTagDto extends BaseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;
}
