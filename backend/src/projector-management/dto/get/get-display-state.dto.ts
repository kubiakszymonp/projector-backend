import { ApiProperty } from '@nestjs/swagger';
import { DisplayTypeEnum } from 'src/projector-management/enums/display-type.enum';
import { GetMediaFileDto } from './get-media-file.dto';
import { BaseDto } from 'src/common/base-dto.dto';

export class GetDisplayStateDto extends BaseDto {

    @ApiProperty()
    displayType: DisplayTypeEnum;

    @ApiProperty()
    emptyDisplay: boolean;

    @ApiProperty()
    textUnitId: string;

    @ApiProperty()
    textUnitPart: number;

    @ApiProperty()
    textUnitPartPage: number;

    @ApiProperty()
    mediaFileId: string | null;

    @ApiProperty()
    textUnitQueueId: string;
}
