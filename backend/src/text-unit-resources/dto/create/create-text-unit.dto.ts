import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTextUnitDto {
    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsOptional()
    transposition?: number;

    @ApiProperty()
    @IsArray()
    textUnitTagIds: string[];

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    displayQueueIds: string[];

    @ApiProperty()
    @IsOptional()
    partsOrder?: string;
}
