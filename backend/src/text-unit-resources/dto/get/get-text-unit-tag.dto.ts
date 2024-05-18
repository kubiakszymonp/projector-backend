import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import e from "express";
import { CreateTextUnitTagDto } from "../create/create-text-unit-tag.dto";
import { BaseDto } from "src/common/base-dto.dto";

export class GetTextUnitTagDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsOptional()
    organizationId?: number;

    static fromTextUnitTag(textUnitTag: GetTextUnitTagDto): GetTextUnitTagDto {
        return {
            id: textUnitTag.id,
            name: textUnitTag.name,
            description: textUnitTag.description,
            organizationId: textUnitTag.organizationId,
        }
    }
}