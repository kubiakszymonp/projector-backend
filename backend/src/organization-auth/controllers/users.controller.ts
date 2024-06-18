import { Controller, Post, Body, Patch, Get, Delete, UseGuards, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UsersService } from "../services/users.service";
import { AuthGuard } from "../guards/auth.guard";
import { GetUserDto } from "../dto/get-user.dto";
import { AuthenticationData } from "src/common/authentication-data";
import { JwtAuthenticationData } from "src/common/jwt-payload";
import { Role } from "../enums/role.enum";

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser({
            ...createUserDto, role: Role.USER
        });
        Role
    }

    @UseGuards(AuthGuard)
    @Patch()
    updateUser(@Body() createUserDto: UpdateUserDto) {
        return this.usersService.updateUser(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get("/by-organization/:organizationId")
    getUsersForOrganization(@Param('organizationId') organizationId: string,
        @AuthenticationData() authenticationData: JwtAuthenticationData): Promise<GetUserDto[]> {
        if (authenticationData.organizationId === organizationId) {
            return this.usersService.getUsersForOrganization(organizationId);
        }
    }

    @UseGuards(AuthGuard)
    @Get("/by-id/:id")
    getUserById(@Param('id') id: string): Promise<GetUserDto> {
        return this.usersService.getUser(id);
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}

