import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import e from "express";
import { CreateTextUnitTagDto } from "../create/create-text-unit-tag.dto";

export class GetTextUnitTagDto extends CreateTextUnitTagDto {
    @ApiProperty()
    id: number;
}