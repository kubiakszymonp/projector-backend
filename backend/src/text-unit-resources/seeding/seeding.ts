import { fstat, readFileSync } from "fs";
import { DisplayQueuesService } from "../services/display-queues.service";
import { TextUnitTagService } from "../services/text-unit-tag.service";
import { TextUnitService } from "../services/text-unit.service";


export const seedTextUnits = async (
    textUnitService: TextUnitService,
    textUnitTagService: TextUnitTagService,
    displayQueuesService: DisplayQueuesService
) => {

    const tag1 = await textUnitTagService.create("1", {
        name: "Papieskie",
        description: "Teksty papieskie",
    });

    const tag2 = await textUnitTagService.create("1", {
        name: "Kolędy",
        description: "Polskie kolędy",
    });

    const tag3 = await textUnitTagService.create("1", {
        name: "Polskie",
        description: "Polskie teksty",
    });

    const tag4 = await textUnitTagService.create("1", {
        name: "Maryjne",
        description: "Angielskie teksty",
    });

    const tag5 = await textUnitTagService.create("1", {
        name: "Wielkopostne",
        description: "Angielskie teksty",
    });

    const tag6 = await textUnitTagService.create("1", {
        name: "Bożonarodzeniowe",
        description: "Angielskie teksty",
    });

    const tag7 = await textUnitTagService.create("1", {
        name: "Wielkanocne",
        description: "Angielskie teksty",
    });

    const textUnit1 = await textUnitService.create("1", {
        content: readFileSync("C:\\Users\\kubia\\Desktop\\dev\\projector-backend\\songs\\Barka.txt", "utf-8"),
        displayQueueIds: [],
        textUnitTagIds: [],
        title: "Barka",
        description: "Barka - tekst piosenki",
        transposition: 0,
    });

    const textUnit2 = await textUnitService.create("1", {
        content: "Wśród nocnej ciszy",
        displayQueueIds: [],
        textUnitTagIds: [tag2.id],
        title: "Wśród nocnej ciszy",
        description: "Wśród nocnej ciszy - tekst kolędy",
        transposition: 0,
    });

    const textUnit3 = await textUnitService.create("1", {
        content: "Bóg się rodzi",
        displayQueueIds: [],
        textUnitTagIds: [tag2.id, tag1.id],
        title: "Bóg się rodzi",
        description: "Bóg się rodzi - tekst kolędy",
        transposition: 0,
    });

    const displayQueue1 = await displayQueuesService.create("1", {
        name: "Playlista na niedzielę",
        textUnitIds: [textUnit1.id, textUnit2.id],
    });

    const displayQueue2 = await displayQueuesService.create("1", {
        name: "Playlista na drugą niedzielę",
        description: "cos tam",
        textUnitIds: [textUnit2.id, textUnit1.id],
    });


    const textUnit4 = await textUnitService.create("1", {
        content: "Kiedy ranne wstają zorze",
        displayQueueIds: [displayQueue1.id],
        textUnitTagIds: [tag1.id],
        title: "Kiedy ranne wstają zorze",
        description: "Kiedy ranne wstają zorze - tekst piosenki",
        transposition: 0,
    });

}

