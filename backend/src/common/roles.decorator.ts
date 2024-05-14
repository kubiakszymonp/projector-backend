import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/organization-auth/enums/role.enum';

export const ROLE_KEY = 'roles';
export const RequiredRole = (role: Role) => SetMetadata(ROLE_KEY, role);