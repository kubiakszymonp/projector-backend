import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { CreateDisplayQueueDto } from "../create/create-display-queue.dto";
import { BaseDto } from "../../../common/base-dto.dto";
import { GetQueueTextUnit } from "./get-queue-text-unit.dto";

export class GetDisplayQueueDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsOptional()
    organizationId?: number;

    @ApiProperty()
    queueTextUnits: GetQueueTextUnit[];


}