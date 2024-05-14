import { Module } from '@nestjs/common';
import { OrganizationAuthService } from './organization-auth.service';
import { OrganizationAuthController } from './organization-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ENVIRONMENT } from 'src/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';

@Module({
  controllers: [OrganizationAuthController],
  providers: [OrganizationAuthService],
  imports: [
    JwtModule.register({
      global: true,
      secret: ENVIRONMENT.JWT_SECRET,
      signOptions: {},
    }),
    TypeOrmModule.forFeature([Organization, User])
  ]
})
export class OrganizationAuthModule { }
