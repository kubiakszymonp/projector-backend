import { ApiProperty } from "@nestjs/swagger";
import { QueueTextUnit } from "src/text-unit-resources/entities/queue-text-unit.entity";

export class GetQueueTextUnit {
    @ApiProperty()
    id: number;

    @ApiProperty()
    textTitle: string;

    @ApiProperty()
    queueName: string;

    @ApiProperty()
    position: number;

    static fromQueueTextUnit(queueTextUnit: QueueTextUnit): GetQueueTextUnit {
        return {
            id: queueTextUnit.id,
            textTitle: queueTextUnit.textUnit.title,
            queueName: queueTextUnit.displayQueue.name,
            position: queueTextUnit.position,
        }
    }
}