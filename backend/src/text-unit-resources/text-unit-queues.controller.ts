import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TextUnitQueuesService } from './text-unit-queues.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { TextUnitQueueDto } from './dto/text-unit-queue.dto';
import { SetCurrentTextUnitQueueDto } from '../projector-management/dto/set-current-text-unit-queue.dto';

@ApiTags('text-unit-queues')
@Controller('text-unit-queues')
@UseGuards(AuthGuard)
export class TextUnitQueuesController {
  constructor(private readonly textUnitQueuesService: TextUnitQueuesService) { }

  @Post()
  create(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() createTextUnitQueueDto: TextUnitQueueDto,
  ) {
    return this.textUnitQueuesService.create(
      createTextUnitQueueDto,
      authenticationData.organizationId,
    );
  }

  @Get()
  findAll(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<TextUnitQueueDto[]> {
    return this.textUnitQueuesService.findAll(authenticationData.organizationId);
  }

  @Get('/by-id/:id')
  findOne(@Param('id') id: string): Promise<TextUnitQueueDto> {
    return this.textUnitQueuesService.findOne(+id);
  }

  @Patch()
  update(@Body() updateTextUnitQueueDto: TextUnitQueueDto) {
    return this.textUnitQueuesService.update(
      updateTextUnitQueueDto.id,
      updateTextUnitQueueDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textUnitQueuesService.remove(+id);
  }

  // @UseGuards(AuthGuard)
  // @Patch('current')
  // setCurrentTextUnitQueue(
  //   @AuthenticationData() authenticationData: JwtAuthenticationData,
  //   @Body() setCurrentTextUnitQueueDto: SetCurrentTextUnitQueueDto,
  // ) {
  //   return this.textUnitQueuesService.setCurrentTextUnitQueue(
  //     +authenticationData.organizationId,
  //     setCurrentTextUnitQueueDto.id,
  //   );
  // }

  // @UseGuards(AuthGuard)
  // @Get('current')
  // getCurrentTextUnitQueue(
  //   @AuthenticationData() authenticationData: JwtAuthenticationData,
  // ): Promise<TextUnitQueueDto> {
  //   return this.textUnitQueuesService.getCurrentTextUnitQueue(+authenticationData.organizationId);
  // }
}
