import { DisplayQueuesService } from "../services/display-queues.service";
import { TextUnitTagService } from "../services/text-unit-tag.service";
import { TextUnitService } from "../services/text-unit.service";


export const seedTextUnits = async (
    textUnitService: TextUnitService,
    textUnitTagService: TextUnitTagService,
    displayQueuesService: DisplayQueuesService
) => {

    const tag1 = await textUnitTagService.create(null, {
        name: "Papieskie",
        description: "Teksty papieskie",
    });

    const tag2 = await textUnitTagService.create(null, {
        name: "Kolędy",
        description: "Polskie kolędy",
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
        textUnitTagIds: [tag2.id],
        title: "Wśród nocnej ciszy",
        description: "Wśród nocnej ciszy - tekst kolędy",
        transposition: 0,
    });

    const textUnit3 = await textUnitService.create(null, {
        content: "Bóg się rodzi",
        displayQueueIds: [],
        textUnitTagIds: [tag2.id, tag1.id],
        title: "Bóg się rodzi",
        description: "Bóg się rodzi - tekst kolędy",
        transposition: 0,
    });

    const displayQueue1 = await displayQueuesService.create(null, {
        name: "Playlista na niedzielę",
        textUnitIds: [textUnit1.id, textUnit2.id],
    });

    const displayQueue2 = await displayQueuesService.create(null, {
        name: "Playlista na drugą niedzielę",
        description: "cos tam",
        textUnitIds: [textUnit2.id, textUnit1.id],
    });
    

    const textUnit4 = await textUnitService.create(null, {
        content: "Kiedy ranne wstają zorze",
        displayQueueIds: [displayQueue1.id],
        textUnitTagIds: [tag1.id],
        title: "Kiedy ranne wstają zorze",
        description: "Kiedy ranne wstają zorze - tekst piosenki",
        transposition: 0,
    });
}

