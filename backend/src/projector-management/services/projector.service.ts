import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ProjectorService {

  constructor(
    @InjectRepository(DisplayState) private displayStateRepository: Repository<DisplayState>,
    private projectorSettingsService: ProjectorSettingsService,
    private textUnitService: TextUnitService,
    private webRtcSignalingService: WebRtcSignalingService,
  ) {
  }

  async getState(organizationId: number): Promise<GetDisplayDto> {
    const projectorSettings = await this.projectorSettingsService.findOne(organizationId);

    if (!projectorSettings) {
      throw new Error('No projector settings found');
    }

    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
      relations: ['mediaFile'],
    });

    if (!displayState) {
      throw new Error('No display state found');
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

  async getStateMedia(displayState: DisplayState): Promise<GetDisplayDto> {
    return {
      displayType: DisplayTypeEnum.MEDIA,
      emptyDisplay: displayState.emptyDisplay,
      mediaFile: displayState.mediaFile,
    }
  }

  async getStateWebRtc(displayState: DisplayState): Promise<GetDisplayDto> {
    return {
      displayType: DisplayTypeEnum.WEB_RTC,
      emptyDisplay: displayState.emptyDisplay,
      webRtcState: this.webRtcSignalingService.getState(displayState.organizationId.toString()),
    }
  }

  async getStateText(displayState: DisplayState, projectorSettings: GetProjectorSettingsDto): Promise<GetDisplayDto> {
    const textUnit = await this.textUnitService.findOne(displayState.textUnitId);

    let lines: string[] = [];

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