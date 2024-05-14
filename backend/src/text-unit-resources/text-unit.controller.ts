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
import { SetCurrentTextUnitDto } from './dto/set-current-text-unit.dto';
import { TextUnitDto } from './dto/text-unit.dto';
import { TextUnitService } from './text-unit.service';
import { AuthenticationData } from 'src/common/request-organization';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { AuthGuard } from 'src/organization-auth/guards/auth.guard';

@ApiTags('text-units')
@UseGuards(AuthGuard)
@Controller('text-units')
export class TextUnitController {
  constructor(private readonly textUnitService: TextUnitService) { }

  @Post()
  create(
    @Body() createTextUnitDto: TextUnitDto,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): void {
    this.textUnitService.create(authenticationData.organizationId, createTextUnitDto);
  }

  @Get()
  async findAll(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<TextUnitDto[]> {
    return this.textUnitService.findAll(authenticationData.organizationId);
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
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<TextUnitDto> {
    return this.textUnitService.getCurrentTextUnit(+authenticationData.organizationId);
  }

  @UseGuards(AuthGuard)
  @Patch('/current')
  setCurrentTextUnit(
    @Body() setCurrentTextUnitDto: SetCurrentTextUnitDto,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.textUnitService.setCurrentTextUnit(
      setCurrentTextUnitDto.id,
      +authenticationData.organizationId,
    );
  }
}
