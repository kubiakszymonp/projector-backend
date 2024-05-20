import { UseGuards, Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthenticationData } from "../../common/authentication-data";
import { JwtAuthenticationData } from "../../common/jwt-payload";
import { AuthGuard } from "../../organization-auth/guards/auth.guard";
import { BackupData, BackupService } from "../services/backup.service";
import { deflate, deflateSync } from "zlib";


@ApiTags('backup')
@UseGuards(AuthGuard)
@Controller('backup')
export class BackupController {
    constructor(private readonly backupService: BackupService) { }

    @Post()
    applyBackup(
        @Body() backupData: string,
        @AuthenticationData() authenticationData: JwtAuthenticationData,
    ): void {
        const backupDataParsed = JSON.parse(backupData);
        this.backupService.restoreForOrganization(authenticationData.organizationId, backupDataParsed);
    }

    @Get()
    async fetchBackup(
        @AuthenticationData() authenticationData: JwtAuthenticationData,
    ): Promise<string> {
        const backupData = await this.backupService.backupForOrganization(authenticationData.organizationId);
        return JSON.stringify(backupData);
    }

    @Post("compressed")
    async applyBackupCompressed(
        @Body() backupDataCompressed: string,
        @AuthenticationData() authenticationData: JwtAuthenticationData,
    ): Promise<void> {
        const backupData = await this.backupService.decompressString(backupDataCompressed);
        const backupDataParsed = JSON.parse(backupData);
        this.backupService.restoreForOrganization(authenticationData.organizationId, backupDataParsed);
    }

    @Get("compressed")
    async fetchBackupCompressed(
        @AuthenticationData() authenticationData: JwtAuthenticationData,
    ) {
        const backupData = await this.backupService.backupForOrganization(authenticationData.organizationId);
        return this.backupService.compressString(JSON.stringify(backupData));
    }

}
