import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MovePageDirectionEnum } from 'src/projector-management/enums/move-page-direction.enum';

export class MovePageDto {
  @ApiProperty()
  @IsEnum(MovePageDirectionEnum)
  @IsNotEmpty()
  direction: MovePageDirectionEnum;
}
