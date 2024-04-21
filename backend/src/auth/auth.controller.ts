import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import {
  RequestOrganization,
  RequestOrganizationType,
} from './request-organization';
import { GetOrganizationDto } from 'src/organizations/dto/get-organization.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getProfile(
    @RequestOrganization() organization: RequestOrganizationType,
  ): GetOrganizationDto {
    return organization;
  }
}
