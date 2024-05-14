import { Controller, Post, Body, Patch, Get, Delete, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UsersService } from "../services/users.service";
import { AuthGuard } from "../guards/auth.guard";

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Post("user")
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Patch("user")
    updateUser(@Body() createUserDto: UpdateUserDto) {
        return this.usersService.updateUser(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get("user")
    getUsers() {
        return this.usersService.getUsers();
    }

    @UseGuards(AuthGuard)
    @Get("user/:id")
    getUser(id: number) {
        return this.usersService.getUser(id);
    }

    @UseGuards(AuthGuard)
    @Delete("user/:id")
    deleteUser(id: number) {
        return this.usersService.deleteUser(id);
    }
}

