import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ENVIRONMENT } from "src/environment";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
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

    async getUsers() {
        return await this.userRepository.find();
    }

    async getUser(id: string) {
        return await this.userRepository.findOne({ where: { id } });
    }


    async deleteUser(id: string) {
        return await this.userRepository.delete({ id });
    }
}
