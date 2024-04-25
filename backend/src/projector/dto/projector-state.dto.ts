import { ApiProperty } from '@nestjs/swagger';
import { DisplayType } from 'src/database/structures/display-type.enum';
import { ProjectorSettingsConfigurationDto } from 'src/database/structures/projector-settings-configuration';
import { TextUnitState } from 'src/database/structures/projector-state-text-state';
import { UploadedFileDto } from 'src/uploaded-files/dto/uploaded-file.dto';

export class GetProjectorStateDto {
  @ApiProperty()
  displayType: DisplayType;
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
