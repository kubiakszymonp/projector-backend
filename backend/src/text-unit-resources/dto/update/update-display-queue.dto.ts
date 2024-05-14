import { PartialType, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateDisplayQueueDto } from "../create/create-display-queue.dto";

export class UpdateDisplayQueueDto extends PartialType(CreateDisplayQueueDto) {
    @ApiProperty()
    @IsNotEmpty()
    id: number;
}