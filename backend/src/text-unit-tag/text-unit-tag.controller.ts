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
import { TextUnitTagService } from './text-unit-tag.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import {
  RequestOrganization,
  RequestOrganizationType,
} from 'src/auth/request-organization';
import { TextUnitTagDto } from './dto/text-unit-tag.dto';

@ApiTags('text-unit-tag')
@UseGuards(AuthGuard)
@Controller('text-unit-tag')
export class TextUnitTagController {
  constructor(private readonly textUnitTagService: TextUnitTagService) {}

  @Post()
  create(
    @Body() createTextUnitTagDto: TextUnitTagDto,
    @RequestOrganization() organization: RequestOrganizationType,
  ) {
    return this.textUnitTagService.create(
      createTextUnitTagDto,
      +organization.id,
    );
  }

  @Get()
  findAll(
    @RequestOrganization() organization: RequestOrganizationType,
  ): Promise<TextUnitTagDto[]> {
    return this.textUnitTagService.findAll(+organization.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @RequestOrganization() organization: RequestOrganizationType,
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
