import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DisplayTypeEnum } from 'src/projector-management/enums/display-type.enum';
import { TextStrategyEnum } from 'src/projector-management/enums/text-strategy.enum';
import { DisplayState } from '../entities/display-state.entity';
import { GetDisplayDto } from '../dto/get/get-display.dto';
import { WebRtcSignalingService } from './webrtc-signaling.service';
import { LinesWrapperPaginator, OrderedParsedTextUnit } from 'text-parser';
import { ProjectorSettingsService } from './projector-settings.service';
import { GetProjectorSettingsDto } from '../dto/get/get-projector-settings.dto';
import { TextUnitService } from 'src/text-unit-resources/services/text-unit.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DisplayStateService } from './display-state.service';
import { GetDisplayStateDto } from '../dto/get/get-display-state.dto';

@Injectable()
export class ProjectorService {

  constructor(
    @InjectRepository(DisplayState) private displayStateRepository: Repository<DisplayState>,
    private projectorSettingsService: ProjectorSettingsService,
    private textUnitService: TextUnitService,
    private webRtcSignalingService: WebRtcSignalingService,
    private displayStateService: DisplayStateService,
  ) {
  }

  async getState(organizationId: string): Promise<GetDisplayDto> {
    let projectorSettings = await this.projectorSettingsService.findOne(organizationId);

    if (!projectorSettings) {
      throw new NotFoundException('No projector settings found');
    }

    let displayState = await this.displayStateService.findOne(organizationId);

    if (!displayState) {
      throw new NotFoundException('No projector state found');
    }

    if (displayState.displayType === DisplayTypeEnum.MEDIA) {
      return this.getStateMedia(displayState);
    }

    if (displayState.displayType === DisplayTypeEnum.WEB_RTC) {
      return this.getStateWebRtc(displayState);
    }

    if (displayState.displayType === DisplayTypeEnum.TEXT) {
      return this.getStateText(displayState, projectorSettings);
    }
  }

  async getStateMedia(displayState: GetDisplayStateDto): Promise<GetDisplayDto> {
    return {
      displayType: DisplayTypeEnum.MEDIA,
      emptyDisplay: displayState.emptyDisplay,
      mediaFile: displayState.mediaFile,
    }
  }

  async getStateWebRtc(displayState: GetDisplayStateDto): Promise<GetDisplayDto> {
    return {
      displayType: DisplayTypeEnum.WEB_RTC,
      emptyDisplay: displayState.emptyDisplay,
    }
  }

  async getStateText(displayState: GetDisplayStateDto, projectorSettings: GetProjectorSettingsDto): Promise<GetDisplayDto> {
    const textUnit = await this.textUnitService.findOne(displayState.textUnitId);

    let lines: string[] = [];

    if (textUnit) {

      const order = (textUnit.partsOrder || "").split(',').map((part) => parseInt(part, 10));
      const orderedParsedText = new OrderedParsedTextUnit(textUnit.content, order);

      if (projectorSettings.textStrategy === TextStrategyEnum.AUTOMATIC) {
        lines = orderedParsedText.getPartByOrder(displayState.textUnitPart).lines;
      }

      if (projectorSettings.textStrategy === TextStrategyEnum.FIXED_LINES) {

        const linesWrapperPaginator = new LinesWrapperPaginator(
          orderedParsedText.getPartByOrder(displayState.textUnitPart).lines,
          projectorSettings.charactersInLine,
          projectorSettings.linesOnPage,
        );

        lines = linesWrapperPaginator.getPage(displayState.textUnitPartPage);
      }
    }

    return {
      displayType: DisplayTypeEnum.TEXT,
      emptyDisplay: displayState.emptyDisplay,
      lines,
    }
  }
}

// private getRandomLatinLetter() {
//   const randomNumberInRadix = Math.random().toString(36);
//   for (let i = 0; i < randomNumberInRadix.length; i++) {
//     if (randomNumberInRadix[i].match(/[a-z]/i)) {
//       return randomNumberInRadix[i];
//     }
//   }
// }

// private generateSpaceWithProbability(probability: number) {
//   return Math.random() < probability ? ' ' : '';
// }

// private generateRandomTextWithSpaces(length: number) {
//   return Array.from(
//     { length: length },
//     () =>
//       this.getRandomLatinLetter() + this.generateSpaceWithProbability(0.25),
//   ).join('');
// }