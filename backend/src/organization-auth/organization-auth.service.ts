import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { JwtAuthenticationData } from 'src/common/jwt-payload';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ENVIRONMENT } from 'src/environment';
import { seedOrganizations, seedUsers } from './seeding/seeding';
import { Role } from './enums/role.enum';

@Injectable()
export class OrganizationAuthService {

    constructor(
        @InjectRepository(Organization) private organizationRepository: Repository<Organization>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {
        if (ENVIRONMENT.SEED_ORGANIZATIONS) {
            seedOrganizations(this);
            seedUsers(this);
        }
    }

    async login(loginDto: LoginDto) {

        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
            relations: ['organization'],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        if (user.password !== loginDto.password) {
            throw new UnauthorizedException('Invalid password');
        }

        const tokenPayload: JwtAuthenticationData = {
            email: user.email,
            id: user.id,
            organizationId: user.organizationId,
            role: user.role,
        };

        return await this.jwtService.signAsync(tokenPayload);
    }

    async validateJwt(jwt: string) {
        const verificationResult = await this.jwtService.verifyAsync(jwt);
        return verificationResult;
    }

    async createOrganization(createOrganizationDto: CreateOrganizationDto) {
        const createdOrganization = this.organizationRepository.create(createOrganizationDto);
        return await this.organizationRepository.save(createdOrganization);
    }

    async createUser(user: CreateUserDto) {
        const createdUser = this.userRepository.create(user);
        return await this.userRepository.save(createdUser);
    }

    async updateUser(updateUserDto: UpdateUserDto) {
        const updatedUser = await this.userRepository.findOne({ where: { id: updateUserDto.id } });
        if (!updatedUser) {
            throw new UnauthorizedException('User not found');
        }

        return await this.userRepository.save(updateUserDto);
    }

    async updateOrganization(updateOrganizationDto: UpdateOrganizationDto) {
        const updatedOrganization = await this.organizationRepository.findOne({ where: { id: updateOrganizationDto.id } });
        if (!updatedOrganization) {
            throw new UnauthorizedException('Organization not found');
        }

        return await this.organizationRepository.save(updateOrganizationDto);
    }

    async getOrganizations() {
        return await this.organizationRepository.find();
    }

    async getUsers() {
        return await this.userRepository.find();
    }

    async getUser(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }

    async getOrganization(id: number) {
        return await this.organizationRepository.findOne({ where: { id } });
    }

    async deleteUser(id: number) {
        return await this.userRepository.delete({ id });
    }

    async deleteOrganization(id: number) {
        return await this.organizationRepository.delete({ id });
    }
}
