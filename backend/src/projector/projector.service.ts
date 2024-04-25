import { Injectable } from '@nestjs/common';
import { GetProjectorStateDto } from './dto/projector-state.dto';
import { RepositoryFactory } from 'src/database/repository.factory';
import { Repository } from 'typeorm';
import { ProjectorSettings } from 'src/database/entities/projector-settings.entity';
import { DisplayState } from 'src/database/entities/display-state.entity';
import { Song, SongDivider } from 'song-parser';
import { DisplayType } from 'src/database/structures/display-type.enum';
import { TextUnit } from 'src/database/entities/text-unit.entity';
import { TextStrategy } from 'src/database/structures/text-strategy.enum';
import { TextUnitState } from 'src/database/structures/projector-state-text-state';
import { ProjectorLastUpdateService } from './projector-last-update.service';

@Injectable()
export class ProjectorService {
  private projectorSettingsRepository: Repository<ProjectorSettings>;
  private displayStateRepository: Repository<DisplayState>;
  private textUnitRepository: Repository<TextUnit>;

  constructor(repoFactory: RepositoryFactory, private projectorLastUpdateService: ProjectorLastUpdateService) {
    this.projectorSettingsRepository =
      repoFactory.getRepository(ProjectorSettings);
    this.displayStateRepository = repoFactory.getRepository(DisplayState);
    this.textUnitRepository = repoFactory.getRepository(TextUnit);
  }

  async getState(organizationId: number): Promise<GetProjectorStateDto> {
    const projectorSettings = await this.projectorSettingsRepository.findOne({
      where: { organization: { id: organizationId } },
    });

    if (!projectorSettings) {
      throw new Error('No projector settings found');
    }

    const displayState = await this.displayStateRepository.findOne({
      where: { organization: { id: organizationId } },
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
      displayState.displayType === DisplayType.NONE ||
      displayState.displayType === DisplayType.MEDIA ||
      displayState.displayType === DisplayType.HLS
    ) {
      return {
        displayType: displayState.displayType,
        settings: projectorSettings,
        textState: displayState.textState,
        lines: [],
        uploadedFile: displayState.uploadedFile,
        lastUpdateTime:  this.projectorLastUpdateService.getLastUpdate(organizationId)
      };
    } else {
      return {
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
        lastUpdateTime:  this.projectorLastUpdateService.getLastUpdate(organizationId)
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
