import { Controller, UseGuards, Post, Body, Patch, Get, Delete, Param } from "@nestjs/common";
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
    @Post()
    createOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationsService.createOrganization(createOrganizationDto);
    }

    @UseGuards(AuthGuard)
    @Patch()
    updateOrganization(@Body() createOrganizationDto: UpdateUserDto) {
        return this.organizationsService.updateOrganization(createOrganizationDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    getOrganizations() {
        return this.organizationsService.getOrganizations();
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    getOrganization(@Param('id') id: string) {
        return this.organizationsService.getOrganization(id);
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    deleteOrganization(@Param('id') id: string) {
        return this.organizationsService.deleteOrganization(id);
    }
}

