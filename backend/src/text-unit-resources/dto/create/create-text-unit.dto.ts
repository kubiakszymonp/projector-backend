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
    transposition?: string;

    @ApiProperty()
    @IsArray()
    textUnitTagIds: number[];

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    displayQueueIds: number[];
}
