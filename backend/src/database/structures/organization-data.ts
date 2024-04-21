import { ApiProperty } from '@nestjs/swagger';

export class OrganizationData {
  @ApiProperty()
  name: string;
}

export const organizationDataDefault: OrganizationData = {
  name: 'Nazwa organizacji',
};
