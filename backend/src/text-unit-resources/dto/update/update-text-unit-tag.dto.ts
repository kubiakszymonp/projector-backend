import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateTextUnitTagDto } from "../create/create-text-unit-tag.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateTextUnitTagDto extends PartialType(CreateTextUnitTagDto) {
    @ApiProperty()
    @IsNotEmpty()
    id: string;
}
