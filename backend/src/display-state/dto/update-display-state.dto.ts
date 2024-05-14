import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DisplayType } from 'src/projector-management/enums/display-type.enum';
import { TextUnitState } from 'src/projector-management/structures/projector-state-text-state';

export class UpdateDisplayStateDto {
  @ApiProperty()
  @IsEnum(DisplayType)
  @IsOptional()
  displayType?: DisplayType;

  @ApiProperty()
  @IsOptional()
  textState?: TextUnitState;

  @ApiProperty()
  @IsOptional()
  emptyDisplay?: boolean;
}
