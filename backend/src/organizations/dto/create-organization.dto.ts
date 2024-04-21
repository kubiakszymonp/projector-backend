import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { OrganizationData } from 'src/database/structures/organization-data';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsNotEmpty()
  data: OrganizationData;

  @ApiProperty()
  @IsNotEmpty()
  accessCode: string;
}
