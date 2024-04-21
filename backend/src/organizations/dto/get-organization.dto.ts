import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base-dto.dto';
import { OrganizationData } from 'src/database/structures/organization-data';

export class GetOrganizationDto extends BaseDto {
  @ApiProperty()
  data: OrganizationData;
  @ApiProperty()
  accessCode: string;
}
