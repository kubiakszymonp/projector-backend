import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { OrganizationAuthService } from './organization-auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('organization-auth')
export class OrganizationAuthController {
  constructor(private readonly organizationAuthService: OrganizationAuthService) { }

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.organizationAuthService.login(loginDto);
  }

  @Post("user")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.organizationAuthService.createUser(createUserDto);
  }

  @Post("organization")
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationAuthService.createOrganization(createOrganizationDto);
  }

  @Patch("user")
  updateUser(@Body() createUserDto: UpdateUserDto) {
    return this.organizationAuthService.updateUser(createUserDto);
  }

  @Patch("organization")
  updateOrganization(@Body() createOrganizationDto: UpdateUserDto) {
    return this.organizationAuthService.updateOrganization(createOrganizationDto);
  }

  @Get("organization")
  getOrganizations() {
    return this.organizationAuthService.getOrganizations();
  }

  @Get("user")
  getUsers() {
    return this.organizationAuthService.getUsers();
  }

  @Get("user/:id")
  getUser(id: number) {
    return this.organizationAuthService.getUser(id);
  }

  @Get("organization/:id")
  getOrganization(id: number) {
    return this.organizationAuthService.getOrganization(id);
  }
}

