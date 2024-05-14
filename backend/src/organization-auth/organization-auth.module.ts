import { Module } from '@nestjs/common';
import { OrganizationAuthService } from './organization-auth.service';
import { OrganizationAuthController } from './organization-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ENVIRONMENT } from 'src/environment';

@Module({
  controllers: [OrganizationAuthController],
  providers: [OrganizationAuthService],
  imports: [
    JwtModule.register({
      global: true,
      secret: ENVIRONMENT.JWT_SECRET,
      signOptions: {},
    }),
  ]
})
export class OrganizationAuthModule { }
