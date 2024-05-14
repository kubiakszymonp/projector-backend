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
import { AuthGuard } from 'src/auth/auth.guard';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { SetCurrentTextUnitQueueDto } from './dto/set-current-text-unit-queue.dto';
import { TextUnitQueueDto } from './dto/text-unit-queue.dto';

@ApiTags('text-unit-queues')
@Controller('text-unit-queues')
@UseGuards(AuthGuard)
export class TextUnitQueuesController {
  constructor(private readonly textUnitQueuesService: TextUnitQueuesService) {}

  @Post()
  create(
   @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() createTextUnitQueueDto: TextUnitQueueDto,
  ) {
    return this.textUnitQueuesService.create(
      createTextUnitQueueDto,
      organization.id,
    );
  }

  @Get()
  findAll(
   @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<TextUnitQueueDto[]> {
    return this.textUnitQueuesService.findAll(organization.id);
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

  @UseGuards(AuthGuard)
  @Patch('current')
  setCurrentTextUnitQueue(
   @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() setCurrentTextUnitQueueDto: SetCurrentTextUnitQueueDto,
  ) {
    return this.textUnitQueuesService.setCurrentTextUnitQueue(
      +organization.id,
      setCurrentTextUnitQueueDto.id,
    );
  }

  @UseGuards(AuthGuard)
  @Get('current')
  getCurrentTextUnitQueue(
   @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<TextUnitQueueDto> {
    return this.textUnitQueuesService.getCurrentTextUnitQueue(+organization.id);
  }
}
