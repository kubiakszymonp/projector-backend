import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DisplayType } from 'src/database/structures/display-type.enum';
import { TextUnitState } from 'src/database/structures/projector-state-text-state';

export class UpdateDisplayStateDto {
  @ApiProperty()
  @IsEnum(DisplayType)
  @IsOptional()
  displayType?: DisplayType;

  @ApiProperty()
  @IsOptional()
  textState?: TextUnitState;
}
