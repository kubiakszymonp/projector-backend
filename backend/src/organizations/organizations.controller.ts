import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetOrganizationDto } from './dto/get-organization.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  findAll(): Promise<GetOrganizationDto[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GetOrganizationDto> {
    return this.organizationsService.findOne(+id);
  }
}
