import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RepositoryFactory } from 'src/database/repository.factory';
import { Repository } from 'typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private organizationRepository: Repository<Organization>;

  constructor(
    repoFactory: RepositoryFactory,
    private jwtService: JwtService,
  ) {
    this.organizationRepository = repoFactory.getRepository(Organization);
  }

  async login(loginDto: LoginDto) {
    const organization = await this.organizationRepository.findOne({
      where: { accessCode: loginDto.accessCode },
    });

    if (!organization) {
      throw new UnauthorizedException('Invalid organization');
    }

    const tokenPayload = { organization };

    return await this.jwtService.signAsync(tokenPayload);
  }
}
