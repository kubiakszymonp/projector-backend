import { ApiProperty, PartialType } from "@nestjs/swagger";
import { GetProjectorSettingsDto } from "../get/get-projector-settings.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateProjectorSettingDto extends PartialType(GetProjectorSettingsDto) {

    @ApiProperty()
    @IsNotEmpty()
    id: number;
}