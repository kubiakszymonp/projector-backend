import { ApiProperty, PartialType } from "@nestjs/swagger";
import { GetDisplayStateDto } from "../get/get-display-state.dto";

export class UpdateDisplayStateDto extends PartialType(GetDisplayStateDto) {
    @ApiProperty()
    id: number;
}