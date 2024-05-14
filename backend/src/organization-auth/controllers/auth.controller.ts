import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../services/auth.service";


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}

