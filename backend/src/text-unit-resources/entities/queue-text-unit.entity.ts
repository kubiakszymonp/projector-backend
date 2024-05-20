
import { DisplayQueue } from "./display-queue.entity";
import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { TextUnit } from "./text-unit.entity";
import { AppBaseEntity } from "../../common/base-entity";

@Entity()
export class QueueTextUnit extends AppBaseEntity {

    @Column()
    displayQueueId: number;

    @ManyToOne(() => DisplayQueue, queue => queue.queueTextUnits)
    @JoinColumn({ name: 'displayQueueId' })
    displayQueue: DisplayQueue;

    @Column()
    textUnitId: number;

    @ManyToOne(() => TextUnit, textUnit => textUnit.queueTextUnits)
    @JoinColumn({ name: 'textUnitId' })
    textUnit: TextUnit;

    @Column()
    position: number;
}