import { Injectable, NotFoundException } from '@nestjs/common';
import { Song, SongDivider } from 'song-parser';
import { RepositoryFactory } from 'src/database/repository.factory';
import { Repository } from 'typeorm';
import { MovePageDirection, MovePageDto } from './dto/move-page.dto';
import { DisplayState } from 'src/database/entities/display-state.entity';
import { ProjectorSettings } from 'src/database/entities/projector-settings.entity';
import { UpdateDisplayStateDto } from './dto/update-display-state.dto';
import { TextUnit } from 'src/database/entities/text-unit.entity';

@Injectable()
export class DisplayStateService {
  private projectorStateRepository: Repository<DisplayState>;
  private textUnitRepository: Repository<TextUnit>;
  private projectorSettingsRepository: Repository<ProjectorSettings>;

  constructor(repoFactory: RepositoryFactory) {
    this.projectorStateRepository = repoFactory.getRepository(DisplayState);
    this.textUnitRepository = repoFactory.getRepository(TextUnit);
    this.projectorSettingsRepository =
      repoFactory.getRepository(ProjectorSettings);
  }

  async update(
    organizationId: number,
    updateDisplayDto: UpdateDisplayStateDto,
  ) {
    const projectorState = await this.projectorStateRepository.findOne({
      where: { organization: { id: organizationId } },
    });

    if (!projectorState) {
      throw new NotFoundException('No projector state found');
    }

    const newProjectorState = this.projectorStateRepository.create({
      ...projectorState,
      ...updateDisplayDto,
    });

    await this.projectorStateRepository.save(newProjectorState);
  }

  async get(organizationId: number) {
    return this.projectorStateRepository.findOne({
      where: { organization: { id: organizationId } },
    });
  }

  async movePage(organizationId: number, movePageDto: MovePageDto) {
    const projectorState = await this.projectorStateRepository.findOne({
      where: { organization: { id: organizationId } },
    });

    if (!projectorState) {
      throw new NotFoundException('No projector state found');
    }

    const projectorSettings = await this.projectorSettingsRepository.findOne({
      where: { organization: { id: organizationId } },
    });

    if (!projectorSettings) {
      throw new NotFoundException('No projector settings found');
    }

    const currentTextUnit = await this.textUnitRepository.findOne({
      where: { id: projectorState.textState.textUnitId },
    });

    if (!currentTextUnit) {
      throw new NotFoundException('No song found');
    }

    if (movePageDto.direction === MovePageDirection.NEXT) {
      this.goToNextPage(
        projectorState,
        projectorSettings,
        new Song(currentTextUnit.content),
      );
    } else {
      this.goToPreviousPage(projectorState);
    }

    await this.projectorStateRepository.save(projectorState);
  }

  private goToNextPage(
    displayState: DisplayState,
    projectorSettings: ProjectorSettings,
    song: Song,
  ) {
    const songDivider = new SongDivider(
      projectorSettings.charactersInLine,
      projectorSettings.linesOnPage,
      song,
    );

    // if current part has more pages, go to the next page
    if (
      songDivider.getNumberOfPagesForPart(displayState.textState.textUnitPart) -
        1 >
      displayState.textState.textUnitPartPage
    ) {
      displayState.textState.textUnitPartPage++;
    }
    // else if there are more parts, go to the next part
    else if (
      songDivider.getNumberOfParts() - 1 >
      displayState.textState.textUnitPart
    ) {
      displayState.textState.textUnitPart++;
      displayState.textState.textUnitPartPage = 0;
    }
  }

  private goToPreviousPage(projectorState: DisplayState) {
    // if current part has more pages, go to the next page
    if (projectorState.textState.textUnitPartPage > 0) {
      projectorState.textState.textUnitPartPage--;
    }
    // else if there are more parts, go to the next part
    else if (projectorState.textState.textUnitPart > 0) {
      projectorState.textState.textUnitPart--;
      projectorState.textState.textUnitPartPage = 0;
    }
  }
}
