import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateDisplayQueueDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    textUnitIds: number[];
}