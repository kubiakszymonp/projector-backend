import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum MovePageDirection {
  NEXT = 'NEXT',
  PREVIOUS = 'PREVIOUS',
}

export class MovePageDto {
  @ApiProperty()
  @IsEnum(MovePageDirection)
  direction: MovePageDirection;
}
