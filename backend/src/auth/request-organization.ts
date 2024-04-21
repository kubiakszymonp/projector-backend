import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Organization } from 'src/database/entities/organization.entity';

export type RequestOrganizationType = Organization;

export const RequestOrganization = createParamDecorator(
  (_data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest()
      .organization as RequestOrganizationType;
  },
);
