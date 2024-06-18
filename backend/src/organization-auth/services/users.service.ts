import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ENVIRONMENT } from "src/environment";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { Role } from "../enums/role.enum";


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
    }

    async createUser(user: {
        name: string;
        email: string;
        password: string;
        organizationId: string;
        role: Role;
    }) {
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

    async getUsersForOrganization(organizationId: string) {
        return await this.userRepository.find({
            where: { organizationId }
        });
    }

    async getUser(id: string) {
        return await this.userRepository.findOne({ where: { id } });
    }


    async deleteUser(id: string) {
        return await this.userRepository.delete({ id });
    }

    async seedUser(uuid: string, email: string, password: string) {
        const user = await this.userRepository.save({
            email,
            password,
            name: "local admin",
            role: Role.USER,
            organizationId: uuid,
        });

        console.log('Seeded user', user);
        return user;
    }
}

