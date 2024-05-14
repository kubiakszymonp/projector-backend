import { Controller, UseGuards, Post, Body, Patch, Get, Delete } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RequiredRole } from "src/common/roles.decorator";
import { CreateOrganizationDto } from "../dto/create-organization.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../guards/auth.guard";
import { OrganizationsService } from "../services/organizations.service";


@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organizationsService: OrganizationsService) { }


    @UseGuards(AuthGuard)
    @RequiredRole(Role.ADMIN)
    @Post("organization")
    createOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationsService.createOrganization(createOrganizationDto);
    }

    @UseGuards(AuthGuard)
    @Patch("organization")
    updateOrganization(@Body() createOrganizationDto: UpdateUserDto) {
        return this.organizationsService.updateOrganization(createOrganizationDto);
    }

    @UseGuards(AuthGuard)
    @Get("organization")
    getOrganizations() {
        return this.organizationsService.getOrganizations();
    }

    @UseGuards(AuthGuard)
    @Get("organization/:id")
    getOrganization(id: number) {
        return this.organizationsService.getOrganization(id);
    }

    @UseGuards(AuthGuard)
    @Delete("organization/:id")
    deleteOrganization(id: number) {
        return this.organizationsService.deleteOrganization(id);
    }
}

