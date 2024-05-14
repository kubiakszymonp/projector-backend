import { Injectable, NotFoundException } from '@nestjs/common';
import { Song, SongDivider } from 'song-parser';
import { Repository } from 'typeorm';
import { MovePageDirection, MovePageDto } from './dto/move-page.dto';
import { UpdateDisplayStateDto } from './dto/update-display-state.dto';
import { TextStrategy } from 'src/projector-management/enums/text-strategy.enum';
import { ProjectorLastUpdateService } from 'src/projector/projector-last-update.service';
import { DisplayState } from './entities/display-state.entity';
import { TextUnit } from 'src/text-unit-resources/entities/text-unit.entity';
import { ProjectorSettings } from './entities/projector-settings.entity';

@Injectable()
export class DisplayStateService {


  constructor(private projectorStateRepository: Repository<DisplayState>,
    private textUnitRepository: Repository<TextUnit>,
    private projectorSettingsRepository: Repository<ProjectorSettings>,
    private projectorLastUpdateService: ProjectorLastUpdateService) {
  }

  async update(
    organizationId: number,
    updateDisplayDto: UpdateDisplayStateDto,
  ) {
    const projectorState = await this.projectorStateRepository.findOne({
      where: { organizationId },
    });

    if (!projectorState) {
      throw new NotFoundException('No projector state found');
    }

    const newProjectorState = this.projectorStateRepository.create({
      ...projectorState,
      ...updateDisplayDto,
    });

    await this.projectorStateRepository.save(newProjectorState);
    this.projectorLastUpdateService.setLastUpdate(organizationId);
  }

  async get(organizationId: number) {
    return this.projectorStateRepository.findOne({
      where: { organizationId },
    });
  }

  async movePage(organizationId: number, movePageDto: MovePageDto) {
    const projectorState = await this.projectorStateRepository.findOne({
      where: { organizationId},
    });

    if (!projectorState) {
      throw new NotFoundException('No projector state found');
    }

    const projectorSettings = await this.projectorSettingsRepository.findOne({
      where: { organizationId },
    });

    if (!projectorSettings) {
      throw new NotFoundException('No projector settings found');
    }

    // TODO
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
    this.projectorLastUpdateService.setLastUpdate(organizationId);
  }

  private goToNextPage(
    displayState: DisplayState,
    projectorSettings: ProjectorSettings,
    song: Song,
  ) {
    let songDivider: SongDivider;

    if (projectorSettings.textStrategy === TextStrategy.AUTOMATIC) {
      songDivider = new SongDivider(
        1000,
        1000,
        song,
      );
    } else {
      songDivider = new SongDivider(
        projectorSettings.charactersInLine,
        projectorSettings.linesOnPage,
        song,
      );
    }

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
