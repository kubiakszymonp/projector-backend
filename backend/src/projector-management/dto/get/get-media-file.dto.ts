import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/base-dto.dto';

export class GetMediaFileDto extends BaseDto {
  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  size: number;
}
