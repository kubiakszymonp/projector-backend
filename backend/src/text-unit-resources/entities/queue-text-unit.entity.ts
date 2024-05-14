import { AppBaseEntity } from "src/common/base-entity";
import { DisplayQueue } from "./display-queue.entity";
import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { TextUnit } from "./text-unit.entity";

@Entity()
export class QueueTextUnit extends AppBaseEntity {

    @ManyToOne(() => DisplayQueue, queue => queue.queueTextUnits)
    @JoinColumn()
    displayQueue: DisplayQueue;

    @ManyToOne(() => TextUnit, textUnit => textUnit.queueTextUnits)
    @JoinColumn()
    textUnit: TextUnit;

    @Column()
    position: number;
}