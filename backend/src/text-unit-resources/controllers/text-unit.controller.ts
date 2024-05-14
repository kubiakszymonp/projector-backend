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
import { SetCurrentTextUnitDto } from '../../projector-management/dto/set-current-text-unit.dto';
import { TextUnitService } from '../services/text-unit.service';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { CreateTextUnitDto } from '../dto/create/create-text-unit.dto';
import { GetTextUnitDto } from '../dto/get/get-text-unit.dto';
import { UpdateTextUnitDto } from '../dto/update/update-text-unit.dto';

@ApiTags('text-units')
@UseGuards(AuthGuard)
@Controller('text-units')
export class TextUnitController {
  constructor(private readonly textUnitService: TextUnitService) { }

  @Post()
  create(
    @Body() createTextUnitDto: CreateTextUnitDto,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): void {
    this.textUnitService.create(authenticationData.organizationId, createTextUnitDto);
  }

  @Get()
  async findAll(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.textUnitService.findAll(authenticationData.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.textUnitService.findOne(+id);
  }

  @Patch()
  update(@Body() updateTextUnitDto: UpdateTextUnitDto) {
    this.textUnitService.update(+updateTextUnitDto.id, updateTextUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.textUnitService.remove(+id);
  }
}
