import { Test } from "@nestjs/testing";
import { QueueTextUnitService } from "../services/queue-text-unit.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TEST_TIMEOUT, testDbConfig } from "./test-db.config";
import { QueueTextUnit } from "../entities/queue-text-unit.entity";
import { TextUnit } from "../entities/text-unit.entity";
import { DisplayQueue } from "../entities/display-queue.entity";
import { TextUnitService } from "../services/text-unit.service";
import { DisplayQueuesService } from "../services/display-queues.service";
import e from "express";

describe("QueueTextUnitTest", () => {
    let queueTextUnitService: QueueTextUnitService;
    let textUnitService: TextUnitService;
    let displayQueuesService: DisplayQueuesService;

    beforeEach(async () => {
        jest.useFakeTimers({
            legacyFakeTimers: true,
        })
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(testDbConfig),
                TypeOrmModule.forFeature([QueueTextUnit, TextUnit, DisplayQueue]),
            ],
            providers: [QueueTextUnitService, TextUnitService, DisplayQueuesService],
        }).compile();

        queueTextUnitService = module.get(QueueTextUnitService);
        textUnitService = module.get(TextUnitService);
        displayQueuesService = module.get(DisplayQueuesService);
    });

    it("should be defined", () => {
        expect(queueTextUnitService).toBeDefined();
    });

    it("should create queue with text units associated and remove them", async () => {

        const textUnit1 = await textUnitService.create(null, {
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        const textUnit2 = await textUnitService.create(null, {
            content: "Wśród nocnej ciszy",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Wśród nocnej ciszy",
            description: "Wśród nocnej ciszy - tekst kolędy",
            transposition: 0,
        });


        const displayQueue1 = await displayQueuesService.create(null, {
            name: "Playlista na niedzielę",
            textUnitIds: [textUnit1.id, textUnit2.id],
        });

        const afterAddTextUnit1 = await textUnitService.findOne(textUnit1.id);
        const afterAddTextUnit2 = await textUnitService.findOne(textUnit2.id);
        const afterAddDisplayQueue = await displayQueuesService.findOne(displayQueue1.id);

        expect(afterAddTextUnit1.queues).toHaveLength(1);
        expect(afterAddTextUnit2.queues).toHaveLength(1);
        expect(afterAddDisplayQueue.queueTextUnits).toHaveLength(2);

        await queueTextUnitService.removeTextUnitFromQueue(displayQueue1.id, textUnit1.id);

        const afterOneRemovalTextUnit1 = await textUnitService.findOne(textUnit1.id);
        const afterOneRemovalTextUnit2 = await textUnitService.findOne(textUnit2.id);
        const afterOneRemovalDisplayQueue = await displayQueuesService.findOne(displayQueue1.id);

        expect(afterOneRemovalTextUnit1.queues).toHaveLength(0);
        expect(afterOneRemovalTextUnit2.queues).toHaveLength(1);
        expect(afterOneRemovalDisplayQueue.queueTextUnits).toHaveLength(1);

        await queueTextUnitService.removeTextUnitFromQueue(displayQueue1.id, textUnit2.id);

        const afterTwoRemovalsTextUnit1 = await textUnitService.findOne(textUnit1.id);
        const afterTwoRemovalsTextUnit2 = await textUnitService.findOne(textUnit2.id);
        const afterTwoRemovalsDisplayQueue = await displayQueuesService.findOne(displayQueue1.id);

        expect(afterTwoRemovalsTextUnit1.queues).toHaveLength(0);
        expect(afterTwoRemovalsTextUnit2.queues).toHaveLength(0);
        expect(afterTwoRemovalsDisplayQueue.queueTextUnits).toHaveLength(0);
    }, TEST_TIMEOUT);


    it("should append text units to end of the queue", async () => {

        const displayQueue1 = await displayQueuesService.create(null, {
            name: "Playlista na niedzielę",
            textUnitIds: [],
        });

        const textUnit1 = await textUnitService.create(null, {
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        const textUnit2 = await textUnitService.create(null, {
            content: "Wśród nocnej ciszy",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Wśród nocnej ciszy",
            description: "Wśród nocnej ciszy - tekst kolędy",
            transposition: 0,
        });


        const afterAddDisplayQueue = await displayQueuesService.findOne(displayQueue1.id);
        const afterAddTextUnit1 = await textUnitService.findOne(textUnit1.id);
        const afterAddTextUnit2 = await textUnitService.findOne(textUnit2.id);

        expect(afterAddDisplayQueue.queueTextUnits).toHaveLength(0);
        expect(afterAddTextUnit1.queues).toHaveLength(0);
        expect(afterAddTextUnit2.queues).toHaveLength(0);

        await queueTextUnitService.appendTextUnitToQueue(displayQueue1.id, textUnit1.id);

        const afterAppend1DisplayQueue = await displayQueuesService.findOne(displayQueue1.id);
        const afterAppend1TextUnit1 = await textUnitService.findOne(textUnit1.id);
        const afterAppend1TextUnit2 = await textUnitService.findOne(textUnit2.id);

        expect(afterAppend1DisplayQueue.queueTextUnits).toHaveLength(1);
        expect(afterAppend1TextUnit1.queues).toHaveLength(1);
        expect(afterAppend1TextUnit2.queues).toHaveLength(0);
        expect(afterAppend1DisplayQueue.queueTextUnits[0].position).toBe(1);

        await queueTextUnitService.appendTextUnitToQueue(displayQueue1.id, textUnit2.id);

        const afterAppend2DisplayQueue = await displayQueuesService.findOne(displayQueue1.id);
        const afterAppend2TextUnit1 = await textUnitService.findOne(textUnit1.id);
        const afterAppend2TextUnit2 = await textUnitService.findOne(textUnit2.id);

        expect(afterAppend2DisplayQueue.queueTextUnits).toHaveLength(2);
        expect(afterAppend2TextUnit1.queues).toHaveLength(1);
        expect(afterAppend2TextUnit2.queues).toHaveLength(1);
        expect(afterAppend2DisplayQueue.queueTextUnits[1].position).toBe(2);
        expect(afterAppend2DisplayQueue.queueTextUnits[0].position).toBe(1);

    }, TEST_TIMEOUT);

    it("should remove text units from the queue", async () => {

        const displayQueue1 = await displayQueuesService.create(null, {
            name: "Playlista na niedzielę",
            textUnitIds: [],
        });

        const textUnit1 = await textUnitService.create(null, {
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        const textUnit2 = await textUnitService.create(null, {
            content: "Wśród nocnej ciszy",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Wśród nocnej ciszy",
            description: "Wśród nocnej ciszy - tekst kolędy",
            transposition: 0,
        });

        await queueTextUnitService.appendTextUnitToQueue(displayQueue1.id, textUnit1.id);
        await queueTextUnitService.appendTextUnitToQueue(displayQueue1.id, textUnit2.id);

        const afterAppend2DisplayQueue = await displayQueuesService.findOne(displayQueue1.id);
        const afterAppend2TextUnit1 = await textUnitService.findOne(textUnit1.id);
        const afterAppend2TextUnit2 = await textUnitService.findOne(textUnit2.id);

        expect(afterAppend2DisplayQueue.queueTextUnits).toHaveLength(2);
        expect(afterAppend2TextUnit1.queues).toHaveLength(1);
        expect(afterAppend2TextUnit2.queues).toHaveLength(1);
        expect(afterAppend2DisplayQueue.queueTextUnits[1].position).toBe(2);
        expect(afterAppend2DisplayQueue.queueTextUnits[0].position).toBe(1);

        await queueTextUnitService.removeTextUnitFromQueue(displayQueue1.id, textUnit1.id);

        const afterRemoveDisplayQueue = await displayQueuesService.findOne(displayQueue1.id);
        const afterRemoveTextUnit1 = await textUnitService.findOne(textUnit1.id);
        const afterRemoveTextUnit2 = await textUnitService.findOne(textUnit2.id);

        expect(afterRemoveDisplayQueue.queueTextUnits).toHaveLength(1);
        expect(afterRemoveTextUnit1.queues).toHaveLength(0);
        expect(afterRemoveTextUnit2.queues).toHaveLength(1);
    }, TEST_TIMEOUT);

    it("should remove text units from the queue on text unit update", async () => {

        const displayQueue1 = await displayQueuesService.create(null, {
            name: "Playlista na niedzielę",
            textUnitIds: [],
        });

        const displayQueue2 = await displayQueuesService.create(null, {
            name: "Playlista na drugą niedzielę",
            textUnitIds: [],
        });

        const textUnit1 = await textUnitService.create(null, {
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [],
            textUnitTagIds: [],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        await queueTextUnitService.appendTextUnitToQueue(displayQueue1.id, textUnit1.id);
        await queueTextUnitService.appendTextUnitToQueue(displayQueue2.id, textUnit1.id);

        const afterAppend2DisplayQueue1 = await displayQueuesService.findOne(displayQueue1.id);
        const afterAppend2DisplayQueue2 = await displayQueuesService.findOne(displayQueue2.id);
        const afterAppend2TextUnit1 = await textUnitService.findOne(textUnit1.id);

        expect(afterAppend2DisplayQueue1.queueTextUnits).toHaveLength(1);
        expect(afterAppend2DisplayQueue2.queueTextUnits).toHaveLength(1);
        expect(afterAppend2TextUnit1.queues).toHaveLength(2);

        await textUnitService.update(textUnit1.id, {
            id: textUnit1.id,
            content: "Pan kiedyś stanął nad brzegiem",
            displayQueueIds: [displayQueue2.id],
            textUnitTagIds: [],
            title: "Barka",
            description: "Barka - tekst piosenki",
            transposition: 0,
        });

        const afterUpdateDisplayQueue1 = await displayQueuesService.findOne(displayQueue1.id);
        const afterUpdateDisplayQueue2 = await displayQueuesService.findOne(displayQueue2.id);
        const afterUpdateTextUnit1 = await textUnitService.findOne(textUnit1.id);

        expect(afterUpdateDisplayQueue1.queueTextUnits).toHaveLength(0);
        expect(afterUpdateDisplayQueue2.queueTextUnits).toHaveLength(1);
        expect(afterUpdateTextUnit1.queues).toHaveLength(1);

    }, TEST_TIMEOUT);
});