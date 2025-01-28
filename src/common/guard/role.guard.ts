import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../enum/role.enum';
import { AuthUser } from '../type/auth-user.type';
import { RoleGroup, RoleParam } from '../type/role-groups.type';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user as AuthUser;

        const isPublic: boolean = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler(),
        );
        if (isPublic) return true;

        const classRoles = this.reflector.get<RoleParam>(
            ROLES_KEY,
            context.getClass(),
        );
        const methodRoles = this.reflector.get<RoleParam>(
            ROLES_KEY,
            context.getHandler(),
        );

        if (!classRoles && !methodRoles) return true;

        let roles: Role[] = [];
        let rolesOptions: RoleParam = classRoles;
        if (methodRoles) rolesOptions = methodRoles;

        if (rolesOptions.groups !== undefined)
            roles.push(...this.extractRolesFromGroups(rolesOptions.groups));

        if (rolesOptions.roles !== undefined) roles.push(...rolesOptions.roles);

        roles = Array.from(new Set(roles));
        const isCheckRoles = roles.some((role: Role) => {
            return user.role === role;
        });
        if (!isCheckRoles)
            throw new ForbiddenException(
                `Role ${user.role} not allowed to call this endpoint`,
            );
        return true;
    }

    /**
     * Extract roles from groups
     *
     * @param {RoleGroup[]} groups
     * @returns
     */
    extractRolesFromGroups(groups: RoleGroup[]): Role[] {
        const items = groups.map((group: RoleGroup) => group.roles);

        return items.reduce(
            (prev: Role[], curr: Role[]) => prev.concat(curr),
            [],
        );
    }
}
