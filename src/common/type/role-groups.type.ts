import { Role } from '../enum/role.enum';

export interface RoleGroup {
    name: string;
    roles: Role[];
}

export type RoleParam = {
    groups?: RoleGroup[];
    roles?: Role[];
} & (
    | { groups: RoleGroup[]; roles?: Role[] }
    | { roles: Role[]; groups?: RoleGroup[] }
);
