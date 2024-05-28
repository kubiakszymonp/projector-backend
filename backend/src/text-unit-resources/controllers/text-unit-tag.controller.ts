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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { AuthenticationData } from 'src/common/authentication-data';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';
import { TextUnitTagService } from '../services/text-unit-tag.service';
import { GetTextUnitDto } from '../dto/get/get-text-unit.dto';
import { UpdateTextUnitTagDto } from '../dto/update/update-text-unit-tag.dto';
import { CreateTextUnitTagDto } from '../dto/create/create-text-unit-tag.dto';
import { GetTextUnitTagDto } from '../dto/get/get-text-unit-tag.dto';

@ApiTags('text-unit-tag')
@UseGuards(AuthGuard)
@Controller('text-unit-tag')
export class TextUnitTagController {
  constructor(private readonly textUnitTagService: TextUnitTagService) { }

  @Post()
  create(
    @Body() createTextUnitTagDto: CreateTextUnitTagDto,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.textUnitTagService.create(
      authenticationData.organizationId,
      createTextUnitTagDto,
    );
  }

  @Get()
  findAll(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<GetTextUnitTagDto[]> {
    return this.textUnitTagService.findAll(authenticationData.organizationId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<GetTextUnitTagDto> {
    return this.textUnitTagService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTextUnitTagDto: UpdateTextUnitTagDto,
  ) {
    return this.textUnitTagService.update(+id, updateTextUnitTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textUnitTagService.remove(+id);
  }
}
