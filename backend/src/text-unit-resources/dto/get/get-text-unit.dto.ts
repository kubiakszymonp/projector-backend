import { ApiProperty } from "@nestjs/swagger";
import { CreateTextUnitDto } from "../create/create-text-unit.dto";
import { BaseDto } from "src/common/base-dto.dto";

export class GetTextUnitDto extends BaseDto {
    @ApiProperty()
    content: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    transposition?: number;

    @ApiProperty()
    organizationId?: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    tags: GetTextUnitDtoTag[];

    @ApiProperty()
    queues: GetTextUnitDtoQueue[];
}

export class GetTextUnitDtoTag {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

export class GetTextUnitDtoQueue {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;
}   