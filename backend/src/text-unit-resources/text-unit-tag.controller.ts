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
import { TextUnitTagDto } from './dto/text-unit-tag.dto';
import { TextUnitTagService } from './text-unit-tag.service';

@ApiTags('text-unit-tag')
@UseGuards(AuthGuard)
@Controller('text-unit-tag')
export class TextUnitTagController {
  constructor(private readonly textUnitTagService: TextUnitTagService) { }

  @Post()
  create(
    @Body() createTextUnitTagDto: TextUnitTagDto,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ) {
    return this.textUnitTagService.create(
      createTextUnitTagDto,
      +authenticationData.organizationId,
    );
  }

  @Get()
  findAll(
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<TextUnitTagDto[]> {
    return this.textUnitTagService.findAll(+authenticationData.organizationId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @AuthenticationData() authenticationData: JwtAuthenticationData,
  ): Promise<TextUnitTagDto> {
    return this.textUnitTagService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTextUnitTagDto: TextUnitTagDto,
  ) {
    return this.textUnitTagService.update(+id, updateTextUnitTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textUnitTagService.remove(+id);
  }
}
