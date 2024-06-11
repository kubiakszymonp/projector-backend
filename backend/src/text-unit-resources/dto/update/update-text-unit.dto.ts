import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateTextUnitDto } from "../create/create-text-unit.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateTextUnitDto extends PartialType(CreateTextUnitDto) {
    @ApiProperty()
    @IsNotEmpty()
    id: string;
}