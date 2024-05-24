import { ApiProperty } from "@nestjs/swagger";

export class WebRtcSdpDto {
    @ApiProperty()
    payload: any;
}