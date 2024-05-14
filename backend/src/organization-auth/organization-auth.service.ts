import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationAuthService {
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
