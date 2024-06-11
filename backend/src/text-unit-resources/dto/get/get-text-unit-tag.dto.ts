import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseDto } from "../../../common/base-dto.dto";

export class GetTextUnitTagDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsOptional()
    organizationId?: string;

    static fromTextUnitTag(textUnitTag: GetTextUnitTagDto): GetTextUnitTagDto {
        return {
            id: textUnitTag.id,
            name: textUnitTag.name,
            description: textUnitTag.description,
            organizationId: textUnitTag.organizationId,
        }
    }
}