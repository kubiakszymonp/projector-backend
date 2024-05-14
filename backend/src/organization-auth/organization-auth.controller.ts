import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrganizationAuthService } from './organization-auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('organization-auth')
export class OrganizationAuthController {
  constructor(private readonly organizationAuthService: OrganizationAuthService) { }
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

