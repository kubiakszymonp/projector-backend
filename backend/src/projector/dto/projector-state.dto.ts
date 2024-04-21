import { DisplayType } from 'src/database/structures/display-type.enum';
import { ProjectorStateConfigurationDto } from 'src/database/structures/projector-state-configuration';
import { TextUnitState } from 'src/database/structures/projector-state-text-state';
import { UploadedFileDto } from 'src/uploaded-files/dto/uploaded-file.dto';

export class GetProjectorStateDto {
  displayType: DisplayType;
  textState: TextUnitState;
  settings: ProjectorStateConfigurationDto;
  lines: string[];
  uploadedFile: UploadedFileDto | null;
}
