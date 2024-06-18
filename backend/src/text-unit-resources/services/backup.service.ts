import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TextUnit } from "../entities/text-unit.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DisplayQueue } from "../entities/display-queue.entity";
import { TextUnitTag } from "../entities/text-unit-tag.entity";
import { QueueTextUnit } from "../entities/queue-text-unit.entity";
import { deflate, inflate } from "zlib";
import { ENVIRONMENT } from "../../../src/environment";
import { User } from "src/organization-auth/entities/user.entity";

export interface BackupData {
    textUnits: TextUnit[],
    displayQueues: DisplayQueue[],
    queueTextUnits: QueueTextUnit[],
    textUnitTags: TextUnitTag[],
    users: User[]
}

@Injectable()
export class BackupService {

    constructor(
        @InjectRepository(TextUnit) private textUnitRepository: Repository<TextUnit>,
        @InjectRepository(DisplayQueue) private displayQueueRepository: Repository<DisplayQueue>,
        @InjectRepository(QueueTextUnit) private queueTextUnitRepository: Repository<QueueTextUnit>,
        @InjectRepository(TextUnitTag) private textUnitTagRepository: Repository<TextUnitTag>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }



    async backupForOrganization(organizationId: string): Promise<BackupData> {

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

        const users = await this.userRepository.find({
            where: { organizationId },
        });

        return {
            textUnits,
            displayQueues,
            queueTextUnits,
            textUnitTags,
            users
        }
    }

    async restoreForOrganization(organizationId: string, data: BackupData) {

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

        await this.userRepository.save(data.users.map((user) => {
            user.organizationId = organizationId;
            return user;
        }));
    }

    // async removeAllRelatedToOrganization(organizationId: string) {
    //     const queueTextUnits = await this.queueTextUnitRepository.find({
    //         relations: ['displayQueue'],
    //         where: {
    //             displayQueue: {
    //                 organizationId
    //             }
    //         }
    //     });
    //     if (queueTextUnits.length > 0) {
    //         await this.queueTextUnitRepository.delete(queueTextUnits.map((q) => q.id));
    //     }

    //     await this.textUnitRepository.delete({
    //         organizationId
    //     });

    //     await this.displayQueueRepository.delete({
    //         organizationId
    //     });

    //     await this.textUnitTagRepository.delete({
    //         organizationId
    //     });
    // }

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