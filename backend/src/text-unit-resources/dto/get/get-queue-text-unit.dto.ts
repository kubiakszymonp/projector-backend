import { ApiProperty } from "@nestjs/swagger";
import { QueueTextUnit } from "src/text-unit-resources/entities/queue-text-unit.entity";

export class GetQueueTextUnit {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    position: number;

    static fromQueueTextUnit(queueTextUnit: QueueTextUnit): GetQueueTextUnit {
        return {
            id: queueTextUnit.id,
            title: queueTextUnit.textUnit.title,
            position: queueTextUnit.position,
        }
    }
}