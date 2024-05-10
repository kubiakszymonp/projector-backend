import { PartialType } from "@nestjs/mapped-types";
import { ProjectorSettingsConfigurationDto } from "src/database/structures/projector-settings-configuration";

export class PartialProjectorSettingsConfigurationDto extends PartialType(ProjectorSettingsConfigurationDto) {}