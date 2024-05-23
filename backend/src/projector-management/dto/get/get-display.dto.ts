import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { DisplayTypeEnum } from "src/projector-management/enums/display-type.enum";
import { GetMediaFileDto } from "./get-media-file.dto";
import { WebRtcConnectionStructure } from "src/projector-management/structures/webrtc-connection-structure";

export class GetDisplayDto {
    @ApiProperty()
    displayType: DisplayTypeEnum;

    @ApiProperty()
    emptyDisplay: boolean;

    @ApiProperty()
    @IsOptional()
    lines?: string[];

    @ApiProperty()
    @IsOptional()
    mediaFile?: GetMediaFileDto;

    @ApiProperty()
    @IsOptional()
    webRtcState?: WebRtcConnectionStructure;
}