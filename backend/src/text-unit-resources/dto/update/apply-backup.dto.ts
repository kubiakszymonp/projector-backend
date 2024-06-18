import { ApiProperty } from "@nestjs/swagger";

export class ApplyBackupDto {
    @ApiProperty()
    backup: string;
}