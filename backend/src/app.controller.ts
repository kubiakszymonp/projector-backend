import { Controller, Get } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

export class PingDto {
    @ApiProperty()
    date: Date;
}

@ApiTags()
@Controller()
export class AppController {

    @Get()
    ping(): PingDto {
        return { date: new Date() };
    }
}


