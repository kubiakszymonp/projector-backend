import { TextUnitService } from "../services/text-unit.service";


export const seedTextUnits = async (textUnitService: TextUnitService) => {

    await textUnitService.create(null, {
        content: "Pan kiedyś stanął nad brzegiem",
        displayQueueIds: [],
        textUnitTagIds: [],
        title: "Barka",
        description: "Barka - tekst piosenki",
        transposition: 0,
    });
}