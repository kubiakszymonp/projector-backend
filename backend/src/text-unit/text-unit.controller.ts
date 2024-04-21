import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { SetCurrentTextUnitDto } from './dto/set-current-text-unit.dto';
import { TextUnitDto } from './dto/text-unit.dto';
import { TextUnitService } from './text-unit.service';

@ApiTags('text-units')
@UseGuards(AuthGuard)
@Controller('text-units')
export class TextUnitController {
  constructor(private readonly textUnitService: TextUnitService) {}

  @Post()
  create(
    @Body() createTextUnitDto: TextUnitDto,
    @RequestOrganization() organization: RequestOrganizationType,
  ): void {
    this.textUnitService.create(organization.id, createTextUnitDto);
  }

  @Get()
  async findAll(
    @RequestOrganization() organization: RequestOrganizationType,
  ): Promise<TextUnitDto[]> {
    return this.textUnitService.findAll(organization.id);
  }

  @Get('/by-id/:id')
  findOne(@Param('id') id: string): Promise<TextUnitDto> {
    return this.textUnitService.findOne(+id);
  }

  @Patch()
  update(@Body() updateTextUnitDto: TextUnitDto) {
    this.textUnitService.update(+updateTextUnitDto.id, updateTextUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.textUnitService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/current')
  getCurrentTextUnit(
    @RequestOrganization() organization: RequestOrganizationType,
  ): Promise<TextUnitDto> {
    return this.textUnitService.getCurrentTextUnit(+organization.id);
  }

  @UseGuards(AuthGuard)
  @Patch('/current')
  setCurrentTextUnit(
    @Body() setCurrentTextUnitDto: SetCurrentTextUnitDto,
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    return this.textUnitService.setCurrentTextUnit(
      setCurrentTextUnitDto.id,
      +organization.id,
    );
  }
}
