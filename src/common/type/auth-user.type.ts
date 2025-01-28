import { AuthUserType } from '../enum/auth-user-type.enum';
import { Role } from '../enum/role.enum';

interface CommonUserData {
    userId: string;
    type?: AuthUserType;
    country?: string;
    source?: AuthUserType;
    role?: Role;
    metas?: any;
    ip?: string;
}

export interface ServiceUser extends CommonUserData {}

export type AuthUser =  ServiceUser;
