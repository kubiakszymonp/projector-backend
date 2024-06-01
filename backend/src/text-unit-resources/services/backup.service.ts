import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TextUnit } from "../entities/text-unit.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DisplayQueue } from "../entities/display-queue.entity";
import { TextUnitTag } from "../entities/text-unit-tag.entity";
import { QueueTextUnit } from "../entities/queue-text-unit.entity";
import { deflate, inflate } from "zlib";
import { ENVIRONMENT } from "../../../src/environment";

export interface BackupData {
    textUnits: TextUnit[],
    displayQueues: DisplayQueue[],
    queueTextUnits: QueueTextUnit[],
    textUnitTags: TextUnitTag[],
}

@Injectable()
export class BackupService {

    constructor(
        @InjectRepository(TextUnit) private textUnitRepository: Repository<TextUnit>,
        @InjectRepository(DisplayQueue) private displayQueueRepository: Repository<DisplayQueue>,
        @InjectRepository(QueueTextUnit) private queueTextUnitRepository: Repository<QueueTextUnit>,
        @InjectRepository(TextUnitTag) private textUnitTagRepository: Repository<TextUnitTag>,
    ) { }



    async backupForOrganization(organizationId: number) {

        const textUnits = await this.textUnitRepository.find({
            where: { organizationId },
            relations: ['tags'],
        });

        const displayQueues = await this.displayQueueRepository.find({
            where: { organizationId },
        });

        const queueTextUnits = await this.queueTextUnitRepository.find({
            relations: ['displayQueue'], where: {
                displayQueue: {
                    organizationId
                }
            }
        });

        const textUnitTags = await this.textUnitTagRepository.find({
            where: { organizationId },
        });

        return {
            textUnits,
            displayQueues,
            queueTextUnits,
            textUnitTags,
        }
    }

    async restoreForOrganization(organizationId: number, data: BackupData) {

        if (!ENVIRONMENT.CAN_APPLY_BACKUP) return;
        
        await this.textUnitTagRepository.save(data.textUnitTags.map((textUnitTag) => {
            textUnitTag.organizationId = organizationId;
            return textUnitTag;
        }));

        await this.textUnitRepository.save(data.textUnits.map((textUnit) => {
            textUnit.organizationId = organizationId;
            return textUnit;
        }));

        await this.displayQueueRepository.save(data.displayQueues.map((displayQueue) => {
            displayQueue.organizationId = organizationId;
            return displayQueue;
        }));

        await this.queueTextUnitRepository.save(data.queueTextUnits.map((queueTextUnit) => {
            queueTextUnit.displayQueue.organizationId = organizationId;
            return queueTextUnit;
        }));
    }

    async removeAllRelatedToOrganization(organizationId: number) {
        const queueTextUnits = await this.queueTextUnitRepository.find({
            relations: ['displayQueue'],
            where: {
                displayQueue: {
                    organizationId
                }
            }
        });
        if (queueTextUnits.length > 0) {
            await this.queueTextUnitRepository.delete(queueTextUnits.map((q) => q.id));
        }

        await this.textUnitRepository.delete({
            organizationId
        });

        await this.displayQueueRepository.delete({
            organizationId
        });

        await this.textUnitTagRepository.delete({
            organizationId
        });
    }

    async compressString(data: string): Promise<string> {
        return new Promise((resolve, reject) => {
            deflate(data, (err, buffer) => {
                if (err) {
                    throw reject(err);
                }
                return resolve(buffer.toString());
            });
        });
    }

    async decompressString(data: string): Promise<string> {
        return new Promise((resolve, reject) => {
            inflate(data, (err, buffer) => {
                if (err) {
                    throw reject(err);
                }
                return resolve(buffer.toString());
            });
        });
    }
}