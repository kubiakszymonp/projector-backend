import { ApiProduces, ApiProperty } from "@nestjs/swagger";

export class ExportWebRtcScreenDto {

    @ApiProperty()
    screenId: string;
}