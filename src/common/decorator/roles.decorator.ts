import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RoleParam } from '../type/role-groups.type';

export const ROLES_KEY = 'roles';
export const Roles = (roles: RoleParam): CustomDecorator<string> =>
    SetMetadata(ROLES_KEY, roles);
