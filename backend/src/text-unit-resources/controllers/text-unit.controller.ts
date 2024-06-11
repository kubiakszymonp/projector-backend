import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TextUnitService } from '../services/text-unit.service';
import { AuthenticationData } from 'src/common/authentication-data';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { CreateTextUnitDto } from '../dto/create/create-text-unit.dto';
import { GetTextUnitDto } from '../dto/get/get-text-unit.dto';
import { UpdateTextUnitDto } from '../dto/update/update-text-unit.dto';
import { NotFoundError } from 'rxjs';

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
  async findOne(@Param('id') id: string) {
    const res = await this.textUnitService.findOne(id);

    if (!res) {
      throw new NotFoundException(`Text unit with id ${id} not found`);
    }

    return res;
  }

  @Patch()
  update(@Body() updateTextUnitDto: UpdateTextUnitDto) {
    this.textUnitService.update(updateTextUnitDto.id, updateTextUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.textUnitService.remove(id);
  }
}
