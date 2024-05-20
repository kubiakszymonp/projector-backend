import { ApiProperty } from "@nestjs/swagger";
import { CreateTextUnitDto } from "../create/create-text-unit.dto";
import { BaseDto } from "../../../common/base-dto.dto";
import { GetQueueTextUnit } from "./get-queue-text-unit.dto";
import { GetTextUnitTagDto } from "./get-text-unit-tag.dto";

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
    tags: GetTextUnitTagDto[];

    @ApiProperty()
    queues: GetQueueTextUnit[];
}