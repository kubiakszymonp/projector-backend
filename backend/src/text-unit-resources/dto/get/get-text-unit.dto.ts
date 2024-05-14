import { ApiProperty } from "@nestjs/swagger";
import { CreateTextUnitDto } from "../create/create-text-unit.dto";

export class GetTextUnitDto extends CreateTextUnitDto {
    @ApiProperty()
    id: number;
}
