import { ApiProperty } from "@nestjs/swagger";

export class GetUserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty()
    id: string;
}