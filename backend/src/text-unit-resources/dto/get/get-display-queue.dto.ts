import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { CreateDisplayQueueDto } from "../create/create-display-queue.dto";

export class GetDisplayQueueDto extends CreateDisplayQueueDto {
    @ApiProperty()
    id: number;
}