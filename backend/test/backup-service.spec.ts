import { Test } from "@nestjs/testing";
import { QueueTextUnitService } from "../src/text-unit-resources/services/queue-text-unit.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TEST_TIMEOUT, testDbConfig } from "../src/text-unit-resources/tests/test-db.config";
import { QueueTextUnit } from "../src/text-unit-resources/entities/queue-text-unit.entity";
import { TextUnit } from "../src/text-unit-resources/entities/text-unit.entity";
import { DisplayQueue } from "../src/text-unit-resources/entities/display-queue.entity";
import { TextUnitService } from "../src/text-unit-resources/services/text-unit.service";
import { DisplayQueuesService } from "../src/text-unit-resources/services/display-queues.service";
import { BackupService } from "../src/text-unit-resources/services/backup.service";
import { TextUnitTag } from "../src/text-unit-resources/entities/text-unit-tag.entity";
import { TextUnitTagService } from "../src/text-unit-resources/services/text-unit-tag.service";
import { BackupController } from "../src/text-unit-resources/controllers/backup.controller";
import { JwtService } from "@nestjs/jwt";


describe("QueueTextUnitTest", () => {
    let queueTextUnitService: QueueTextUnitService;
    let textUnitService: TextUnitService;
    let displayQueuesService: DisplayQueuesService;
    let textUnitTagService: TextUnitTagService;
    let backupService: BackupService;
    let backupController: BackupController;

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(testDbConfig),
                TypeOrmModule.forFeature([QueueTextUnit, TextUnit, DisplayQueue, TextUnitTag]),
            ],
            controllers: [BackupController],
            providers: [QueueTextUnitService, TextUnitService, DisplayQueuesService, BackupService, TextUnitTagService, JwtService],
        }).compile();

        queueTextUnitService = module.get(QueueTextUnitService);
        textUnitService = module.get(TextUnitService);
        displayQueuesService = module.get(DisplayQueuesService);
        textUnitTagService = module.get(TextUnitTagService);
        backupService = module.get(BackupService);
        backupController = module.get(BackupController);
    }, TEST_TIMEOUT);

    it("should be defined", () => {
        expect(queueTextUnitService).toBeDefined();
    });

    it("should remove all text units related to organization", async () => {

        const textUnit1 = await textUnitService.create("1", {
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        const textUnit2 = await textUnitService.create("1", {
            content: "Wśród nocnej ciszy",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Wśród nocnej ciszy",
            description: "Wśród nocnej ciszy - tekst kolędy",
            transposition: 0,
        });

        const textUnit3 = await textUnitService.create("2", {
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        const textUnitsForOrganization1 = await textUnitService.findAll("1");
        const textUnitsForOrganization2 = await textUnitService.findAll("2");

        expect(textUnitsForOrganization1.length).toBe("2");
        expect(textUnitsForOrganization2.length).toBe("1");

        await backupService.removeAllRelatedToOrganization("1");

        const textUnitsForOrganization1AfterDelete = await textUnitService.findAll("1");
        const textUnitsForOrganization2AfterDelete = await textUnitService.findAll("2");

        expect(textUnitsForOrganization1AfterDelete.length).toBe(0);
        expect(textUnitsForOrganization2AfterDelete.length).toBe("1");

    }, TEST_TIMEOUT);


    it("should make backup and restore it", async () => {

        const textUnitTag1 = await textUnitTagService.create("1", {
            name: "tag1",
            description: "tag1 description",
        });

        const textUnitTag2 = await textUnitTagService.create("1", {
            name: "tag2",
            description: "tag2 description",
        });

        const textUnit1 = await textUnitService.create("1", {
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [],
            textUnitTagIds: [textUnitTag1.id, textUnitTag2.id],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        const textUnit2 = await textUnitService.create("1", {
            content: "Wśród nocnej ciszy",
            displayQueueIds: [],
            textUnitTagIds: [textUnitTag2.id],
            title: "Wśród nocnej ciszy",
            description: "Wśród nocnej ciszy - tekst kolędy",
            transposition: 0,
        });

        const displayQueue1 = await displayQueuesService.create("1", {
            name: "queue1",
            description: "queue1 description",
            textUnitIds: [textUnit1.id, textUnit2.id],
        });

        const backup = await backupService.backupForOrganization("1");
        expect(backup).not.toBeNull();

        const textUnitsBeforeDeletion = await textUnitService.findAll("1");
        const displayQueuesBeforeDeletion = await displayQueuesService.findAll("1");
        const textUnitTagsBeforeDeletion = await textUnitTagService.findAll("1");
        const textUnit1BeforeDeletion = await textUnitService.findOne(textUnit1.id);
        const displayQueue1BeforeDeletion = await displayQueuesService.findOne(displayQueue1.id);

        expect(textUnitsBeforeDeletion.length).toBe("2");
        expect(displayQueuesBeforeDeletion.length).toBe("1");
        expect(textUnitTagsBeforeDeletion.length).toBe("2");
        expect(textUnit1BeforeDeletion.queues.length).toBe("1");
        expect(displayQueue1BeforeDeletion.queueTextUnits.length).toBe("2");

        await backupService.removeAllRelatedToOrganization("1");

        const textUnitsAfterDeletion = await textUnitService.findAll("1");
        const displayQueuesAfterDeletion = await displayQueuesService.findAll("1");
        const textUnitTagsAfterDeletion = await textUnitTagService.findAll("1");
        const textUnit1AfterDeletion = await textUnitService.findOne(textUnit1.id);
        const displayQueue1AfterDeletion = await displayQueuesService.findOne(displayQueue1.id);

        expect(textUnitsAfterDeletion.length).toBe(0);
        expect(displayQueuesAfterDeletion.length).toBe(0);
        expect(textUnitTagsAfterDeletion.length).toBe(0);
        expect(textUnit1AfterDeletion).toBeNull();
        expect(displayQueue1AfterDeletion).toBeNull();


        await backupService.restoreForOrganization("1", backup);

        const textUnitsAfterRestore = await textUnitService.findAll("1");
        const displayQueuesAfterRestore = await displayQueuesService.findAll("1");
        const textUnitTagsAfterRestore = await textUnitTagService.findAll("1");
        const textUnit1AfterRestore = await textUnitService.findOne(textUnit1.id);
        const displayQueue1AfterRestore = await displayQueuesService.findOne(displayQueue1.id);

        expect(textUnitsAfterRestore.length).toBe("2");
        expect(displayQueuesAfterRestore.length).toBe("1");
        expect(textUnitTagsAfterRestore.length).toBe("2");
        expect(textUnit1AfterRestore.queues.length).toBe("1");
        expect(displayQueue1AfterRestore.queueTextUnits.length).toBe("2");

    }, TEST_TIMEOUT);


    it("backup compression should affect weight", async () => {

        const textUnitTag1 = await textUnitTagService.create("1", {
            name: "tag1",
            description: "tag1 description",
        });

        const textUnitTag2 = await textUnitTagService.create("1", {
            name: "tag2",
            description: "tag2 description",
        });

        const textUnit1 = await textUnitService.create("1", {
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [],
            textUnitTagIds: [textUnitTag1.id, textUnitTag2.id],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        const textUnit2 = await textUnitService.create("1", {
            content: "Wśród nocnej ciszy",
            displayQueueIds: [],
            textUnitTagIds: [textUnitTag2.id],
            title: "Wśród nocnej ciszy",
            description: "Wśród nocnej ciszy - tekst kolędy",
            transposition: 0,
        });

        const displayQueue1 = await displayQueuesService.create("1", {
            name: "queue1",
            description: "queue1 description",
            textUnitIds: [textUnit1.id, textUnit2.id],
        });

        const backup = await backupController.fetchBackup({ organizationId: 1 } as any);
        const backupCompressed = await backupController.fetchBackupCompressed({ organizationId: 1 } as any);

        expect(backup.length).toBeGreaterThan(backupCompressed.length);

    }, TEST_TIMEOUT);




});