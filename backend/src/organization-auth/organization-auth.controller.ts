import { Controller } from '@nestjs/common';
import { OrganizationAuthService } from './organization-auth.service';

@Controller('organization-auth')
export class OrganizationAuthController {
  constructor(private readonly organizationAuthService: OrganizationAuthService) {}
}
