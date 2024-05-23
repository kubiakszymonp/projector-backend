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
import { DisplayQueuesService } from '../services/display-queues.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { CreateDisplayQueueDto } from '../dto/create/create-display-queue.dto';
import { GetDisplayQueueDto } from '../dto/get/get-display-queue.dto';
import { UpdateDisplayQueueDto } from '../dto/update/update-display-queue.dto';

@ApiTags('text-unit-queues')
@Controller('text-unit-queues')
@UseGuards(AuthGuard)
export class DisplayQueuesController {
  constructor(private readonly displayQueuesService: DisplayQueuesService) { }

  @Get()
  findAll(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<GetDisplayQueueDto[]> {
    return this.displayQueuesService.findAll(authenticationData.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GetDisplayQueueDto> {
    return this.displayQueuesService.findOne(+id);
  }

  @Post()
  create(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
    @Body() createTextUnitQueueDto: CreateDisplayQueueDto,
  ) {
    return this.displayQueuesService.create(
      authenticationData.organizationId,
      createTextUnitQueueDto,
    );
  }

  @Patch()
  update(@Body() updateDisplayQueueDto: UpdateDisplayQueueDto) {
    return this.displayQueuesService.update(
      updateDisplayQueueDto.id,
      updateDisplayQueueDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.displayQueuesService.remove(+id);
  }
}
