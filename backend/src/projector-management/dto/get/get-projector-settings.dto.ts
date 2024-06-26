import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base-dto.dto';
import { TextStrategyEnum } from 'src/projector-management/enums/text-strategy.enum';

export class GetProjectorSettingsDto extends BaseDto {

    @ApiProperty()
    backgroundColor: string;

    @ApiProperty()
    fontColor: string;

    @ApiProperty()
    fontFamily: string;

    @ApiProperty()
    fontSize: string;

    @ApiProperty()
    textAlign: string;

    @ApiProperty()
    letterSpacing: string;

    @ApiProperty()
    marginInline: string;

    @ApiProperty()
    marginBlock: string;

    @ApiProperty()
    paddingTop: string;

    @ApiProperty()
    charactersInLine: number;

    @ApiProperty()
    linesOnPage: number;

    @ApiProperty()
    textVertically: string;

    @ApiProperty()
    screenWidth: number;

    @ApiProperty()
    screenHeight: number;

    @ApiProperty()
    lineHeight: string;

    @ApiProperty({
        enum: TextStrategyEnum,
        enumName: 'TextStrategy',
    })
    textStrategy: TextStrategyEnum;
}
