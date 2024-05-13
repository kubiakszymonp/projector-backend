import { Module } from '@nestjs/common';
import { OrganizationAuthService } from './organization-auth.service';
import { OrganizationAuthController } from './organization-auth.controller';

@Module({
  controllers: [OrganizationAuthController],
  providers: [OrganizationAuthService],
})
export class OrganizationAuthModule {}
