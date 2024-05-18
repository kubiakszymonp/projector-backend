import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { QueueTextUnit } from "../entities/queue-text-unit.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { last } from "rxjs";

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

        let lastPosition = 0;
        if (queueTextUnitsSorted.length > 0) {
            lastPosition = queueTextUnitsSorted[queueTextUnitsSorted.length - 1].position;
        }

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

    async setTextUnitToQueues(textUnitId: number, queueIds: number[]) {
        const queueTextUnits = await this.queueTextUnitRepository.find({
            relations: ['displayQueue'],
            where: { textUnit: { id: textUnitId } },
        });

        const appendQueues = queueIds.filter(
            queueId => !queueTextUnits.some(queueTextUnit => queueTextUnit.displayQueue.id === queueId)
        );

        const deleteQueues = queueTextUnits.filter(
            queueTextUnit => !queueIds.includes(queueTextUnit.displayQueue.id)
        );

        const promises = appendQueues.map(queueId => this.appendTextUnitToQueue(queueId, textUnitId));
        await Promise.all(promises);

        if (deleteQueues.length !== 0) {
            await this.queueTextUnitRepository.delete(deleteQueues.map(queueTextUnit => queueTextUnit.id))
        }
    }
}