import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { CreateDisplayQueueDto } from "../create/create-display-queue.dto";
import { BaseDto } from "src/common/base-dto.dto";

export class GetDisplayQueueDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsOptional()
    organizationId?: number;

    @ApiProperty()
    queueTextUnits: GetDisplayQueueDtoQueueTextUnit[];
}

export class GetDisplayQueueDtoQueueTextUnit {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    position: number;
}