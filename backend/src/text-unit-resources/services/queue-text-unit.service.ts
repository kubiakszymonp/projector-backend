import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { QueueTextUnit } from "../entities/queue-text-unit.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class QueueTextUnitService {
    constructor(@InjectRepository(QueueTextUnit) private queueTextUnitRepository: Repository<QueueTextUnit>) {
    }

    async deleteFromQueue(queueId: number) {
        return this.queueTextUnitRepository.delete({ displayQueue: { id: queueId } });
    }

    async addTextUnitsToQueue(queueId: number, textUnitIds: number[]) {

        const queueTextUnits = textUnitIds.map((id, index) => this.queueTextUnitRepository.create({
            displayQueue: { id: queueId },
            textUnit: { id },
            position: index,
        }));

        await this.queueTextUnitRepository.save(queueTextUnits);
    }

    async appendTextUnitToQueue(queueId: number, textUnitId: number) {
        const queueTextUnitsSorted = await this.queueTextUnitRepository.find({
            where: { displayQueue: { id: queueId } },
            order: { position: 'ASC' },
        });

        const lastPosition = queueTextUnitsSorted[queueTextUnitsSorted.length - 1].position;

        const queueTextUnit = this.queueTextUnitRepository.create({
            displayQueue: { id: queueId },
            textUnit: { id: textUnitId },
            position: lastPosition + 1,
        });

        return await this.queueTextUnitRepository.save(queueTextUnit);
    }

    async removeTextUnitFromQueue(queueId: number, textUnitId: number) {
        return this.queueTextUnitRepository.delete({ displayQueue: { id: queueId }, textUnit: { id: textUnitId } });
    }
}