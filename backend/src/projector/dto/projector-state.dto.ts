import { ApiProperty } from '@nestjs/swagger';
import { DisplayType } from 'src/projector-management/enums/display-type.enum';
import { ProjectorSettingsConfigurationDto } from 'src/projector-management/structures/projector-settings-configuration';
import { TextUnitState } from 'src/projector-management/structures/projector-state-text-state';
import { UploadedFileDto } from 'src/projector-management/dto/uploaded-file.dto';

export class GetProjectorStateDto {
  @ApiProperty()
  displayType: DisplayType;
  @ApiProperty()
  emptyDisplay: boolean;
  @ApiProperty()
  textState: TextUnitState;
  @ApiProperty()
  settings: ProjectorSettingsConfigurationDto;
  @ApiProperty()
  lines: string[];
  @ApiProperty()
  uploadedFile: UploadedFileDto | null;
  @ApiProperty()
  lastUpdateTime: number;
}
