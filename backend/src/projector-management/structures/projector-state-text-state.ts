import { ApiProperty } from '@nestjs/swagger';

export class TextUnitState {
  @ApiProperty()
  textUnitId: number;
  @ApiProperty()
  textUnitPart: number;
  @ApiProperty()
  textUnitPartPage: number;
}

export const defaultProjectorStateTextState: TextUnitState = {
  textUnitId: 0,
  textUnitPart: 0,
  textUnitPartPage: 0,
};
