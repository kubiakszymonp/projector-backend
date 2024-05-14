import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthenticationData } from "src/common/jwt-payload";
import { LoginDto } from "../dto/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
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
}
