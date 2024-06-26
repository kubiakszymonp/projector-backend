import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    organizationId: string;
}