import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class WebRtcConnectionStructure {
    @ApiProperty()
    @IsOptional()
    offer?: any | null;

    @ApiProperty()
    @IsOptional()
    answer?: any | null;

    @ApiProperty()
    @IsOptional()
    screenId: string;
}