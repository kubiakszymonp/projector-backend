import { Injectable } from '@nestjs/common';
import { GetProjectorStateDto } from './dto/projector-state.dto';
import { Repository } from 'typeorm';
import { Song, SongDivider } from 'song-parser';
import { DisplayType } from 'src/projector-management/enums/display-type.enum';
import { TextStrategy } from 'src/projector-management/enums/text-strategy.enum';
import { TextUnitState } from 'src/projector-management/structures/projector-state-text-state';
import { ProjectorLastUpdateService } from './projector-last-update.service';
import { TextUnit } from 'src/text-unit-resources/entities/text-unit.entity';
import { DisplayState } from './entities/display-state.entity';
import { ProjectorSettings } from './entities/projector-settings.entity';

@Injectable()
export class ProjectorService {


  constructor(
    private projectorSettingsRepository: Repository<ProjectorSettings>,
    private displayStateRepository: Repository<DisplayState>,
    private textUnitRepository: Repository<TextUnit>,
    private projectorLastUpdateService: ProjectorLastUpdateService,
  ) {
  }

  async getState(organizationId: number): Promise<GetProjectorStateDto> {
    const projectorSettings = await this.projectorSettingsRepository.findOne({
      where: { organizationId },
    });

    if (!projectorSettings) {
      throw new Error('No projector settings found');
    }

    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
      relations: ['uploadedFile'],
    });

    if (!displayState) {
      throw new Error('No display state found');
    }

    const currentTextState = displayState.textState;

    const textUnit = await this.textUnitRepository.findOne({
      where: { id: currentTextState.textUnitId },
    });

    if (
      displayState.displayType === DisplayType.MEDIA ||
      displayState.displayType === DisplayType.HLS
    ) {
      return {
        emptyDisplay: displayState.emptyDisplay,
        displayType: displayState.displayType,
        settings: projectorSettings,
        textState: displayState.textState,
        lines: [],
        uploadedFile: displayState.uploadedFile,
        lastUpdateTime:
          this.projectorLastUpdateService.getLastUpdate(organizationId),
      };
    } else {
      return {
        emptyDisplay: displayState.emptyDisplay,
        displayType: displayState.displayType,
        settings: projectorSettings,
        textState: displayState.textState,
        lines: this.getLines(
          projectorSettings.textStrategy,
          currentTextState,
          textUnit,
          projectorSettings,
        ),
        uploadedFile: displayState.uploadedFile,
        lastUpdateTime:
          this.projectorLastUpdateService.getLastUpdate(organizationId),
      };
    }
  }

  private getRandomLatinLetter() {
    const randomNumberInRadix = Math.random().toString(36);
    for (let i = 0; i < randomNumberInRadix.length; i++) {
      if (randomNumberInRadix[i].match(/[a-z]/i)) {
        return randomNumberInRadix[i];
      }
    }
  }

  private generateSpaceWithProbability(probability: number) {
    return Math.random() < probability ? ' ' : '';
  }

  private generateRandomTextWithSpaces(length: number) {
    return Array.from(
      { length: length },
      () =>
        this.getRandomLatinLetter() + this.generateSpaceWithProbability(0.25),
    ).join('');
  }

  private getLines(
    textStrategy: TextStrategy,
    textUnitState: TextUnitState,
    textUnit: TextUnit,
    projectorSettings: ProjectorSettings,
  ) {
    let partId = textUnitState.textUnitPart;
    let partPage = textUnitState.textUnitPartPage;
    let songToBeDisplayed: Song;
    let songDivider: SongDivider;

    if (!textUnit) {
      songToBeDisplayed = new Song(``);
      songDivider = new SongDivider(
        projectorSettings.charactersInLine,
        projectorSettings.linesOnPage,
        songToBeDisplayed,
      );
    }

    if (textStrategy === TextStrategy.EXAMPLE_TEXT) {
      songToBeDisplayed = new Song(
        `[randomlabel]\n${this.generateRandomTextWithSpaces(200)}`,
      );
      partId = 0;
      partPage = 0;
      songDivider = new SongDivider(
        projectorSettings.charactersInLine,
        projectorSettings.linesOnPage,
        songToBeDisplayed,
      );
    }

    if (textStrategy === TextStrategy.FIXED_LINES && textUnit) {
      songToBeDisplayed = new Song(textUnit.content);
      songDivider = new SongDivider(
        projectorSettings.charactersInLine,
        projectorSettings.linesOnPage,
        songToBeDisplayed,
      );
    }

    if (textStrategy === TextStrategy.AUTOMATIC && textUnit) {
      songToBeDisplayed = new Song(textUnit.content);
      songDivider = new SongDivider(10000, 100, songToBeDisplayed);
      partPage = 0;
    }

    const displayPage = songDivider.getDisplayPageForPart(partId, partPage);

    return displayPage.lines;
  }
}
