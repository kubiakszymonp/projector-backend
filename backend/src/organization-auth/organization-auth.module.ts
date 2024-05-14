import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ENVIRONMENT } from 'src/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { OrganizationController } from './controllers/organizations.controller';
import { UserController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { OrganizationsService } from './services/organizations.service';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { seedOrganizations, seedUsers } from './seeding/seeding';

@Module({
  controllers: [OrganizationController, UserController, AuthController],
  providers: [OrganizationsService, UsersService, AuthService],
  imports: [
    JwtModule.register({
      global: true,
      secret: ENVIRONMENT.JWT_SECRET,
      signOptions: {},
    }),
    TypeOrmModule.forFeature([Organization, User])
  ]
})
export class OrganizationAuthModule {

  constructor(private organizationsService: OrganizationsService, private usersService: UsersService) {
    if (ENVIRONMENT.SEED_ORGANIZATIONS) {
      seedOrganizations(organizationsService);
    }
    if (ENVIRONMENT.SEED_ORGANIZATIONS) {
      seedUsers(usersService);
    }
  }
}
