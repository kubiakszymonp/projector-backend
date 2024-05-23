import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TextStrategyEnum } from 'src/projector-management/enums/text-strategy.enum';
import { DisplayState } from '../entities/display-state.entity';
import { ProjectorSettings } from '../entities/projector-settings.entity';
import { GetDisplayStateDto } from '../dto/get/get-display-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectorSettingsService } from './projector-settings.service';
import { TextUnitService } from 'src/text-unit-resources/services/text-unit.service';
import { UpdateDisplayStateDto } from '../dto/update/update-display-state.dto';
import { MovePageDto } from '../dto/update/move-page.dto';
import { MovePageDirectionEnum } from '../enums/move-page-direction.enum';
import { GetProjectorSettingsDto } from '../dto/get/get-projector-settings.dto';
import { LinesWrapperPaginator, OrderedParsedTextUnit, ParsedTextUnit } from 'text-parser';

@Injectable()
export class DisplayStateService {

  constructor(
    @InjectRepository(DisplayState) private displayStateRepository: Repository<DisplayState>,
    private projectorSettingsService: ProjectorSettingsService,
    private textUnitService: TextUnitService,
  ) {
  }


  async create(organizationId: number) {
    const displayState = this.displayStateRepository.create({
      organizationId,
    });

    await this.displayStateRepository.save(displayState);

    return this.findOne(organizationId);
  }

  async update(
    organizationId: number,
    updateDisplayDto: UpdateDisplayStateDto,
  ) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
    });

    if (!displayState) {
      throw new NotFoundException('No projector state found');
    }

    const newProjectorState = this.displayStateRepository.create({
      ...displayState,
      ...updateDisplayDto,
    });

    await this.displayStateRepository.save(newProjectorState);

    return this.findOne(organizationId);
  }

  async findOne(organizationId: number): Promise<GetDisplayStateDto> {
    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
      relations: ['mediaFile'],
    });

    return {
      displayType: displayState.displayType,
      emptyDisplay: displayState.emptyDisplay,
      textUnitId: displayState.textUnitId,
      textUnitPart: displayState.textUnitPart,
      textUnitPartPage: displayState.textUnitPartPage,
      mediaFileId: displayState.mediaFile?.id,
      textUnitQueueId: displayState.textUnitQueueId,
      id: displayState.id,
      createdAt: displayState.createdAt,
      updatedAt: displayState.updatedAt,
    };
  }

  async movePage(organizationId: number, movePageDto: MovePageDto) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
    });

    if (!displayState) {
      throw new NotFoundException('No projector state found');
    }

    const projectorSettings = await this.projectorSettingsService.findOne(organizationId);

    if (!projectorSettings) {
      throw new NotFoundException('No projector settings found');
    }

    const currentTextUnit = await this.textUnitService.findOne(displayState.textUnitId);

    if (!currentTextUnit) {
      throw new NotFoundException('No song found');
    }

    const order = currentTextUnit.partsOrder.split(',').map((part) => parseInt(part, 10));
    const orderedParsedTextUnit = new OrderedParsedTextUnit(currentTextUnit.content, order);

    if (movePageDto.direction === MovePageDirectionEnum.NEXT) {
      this.goToNextPage(
        displayState,
        projectorSettings,
        orderedParsedTextUnit
      );
    }
    if (movePageDto.direction === MovePageDirectionEnum.PREVIOUS) {
      this.goToPreviousPage(displayState);
    }

    await this.displayStateRepository.save(displayState);

    return this.findOne(organizationId);
  }

  private goToNextPage(
    displayState: DisplayState,
    projectorSettings: GetProjectorSettingsDto,
    orderedParsedTextUnit: OrderedParsedTextUnit,
  ) {

    const numberOfOrderedParts = orderedParsedTextUnit.orderedTextUnitParts.length;

    if (projectorSettings.textStrategy === TextStrategyEnum.AUTOMATIC) {
      if (displayState.textUnitPartPage < numberOfOrderedParts - 1) {
        displayState.textUnitPartPage++;
      }
    }
    if (projectorSettings.textStrategy === TextStrategyEnum.FIXED_LINES) {
      const linesWrapperPaginator = new LinesWrapperPaginator(
        orderedParsedTextUnit.getPartByOrder(displayState.textUnitPart).lines,
        projectorSettings.charactersInLine,
        projectorSettings.linesOnPage,
      );

      const numberOfPages = linesWrapperPaginator.getNumberOfPages();

      if (displayState.textUnitPartPage < numberOfPages - 1) {
        displayState.textUnitPartPage++;
      }
      else if (displayState.textUnitPartPage < numberOfOrderedParts - 1) {
        displayState.textUnitPartPage++;
      }
    }
  }

  private goToPreviousPage(projectorState: DisplayState) {
    // if current part has more pages, go to the next page
    if (projectorState.textUnitPartPage > 0) {
      projectorState.textUnitPartPage--;
    }
    // else if there are more parts, go to the next part
    else if (projectorState.textUnitPart > 0) {
      projectorState.textUnitPart--;
      projectorState.textUnitPartPage = 0;
    }
  }
}
