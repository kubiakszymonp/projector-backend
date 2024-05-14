import { ApiProperty } from '@nestjs/swagger';

export class RenameUploadedFileDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
