import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetCurrentUploadedFileDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
