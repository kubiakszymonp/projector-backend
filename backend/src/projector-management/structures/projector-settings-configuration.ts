import { ApiProperty } from '@nestjs/swagger';
import { TextStrategy } from '../enums/text-strategy.enum';

export class ProjectorSettingsConfigurationDto {
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
    enum: TextStrategy,
    enumName: 'TextStrategy',
  })
  textStrategy: TextStrategy;
}
