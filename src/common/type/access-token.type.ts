import { AuthUserType } from "../enum/auth-user-type.enum";

export interface AccessToken {
    userId: number;
    name?: string;
    type: AuthUserType;
    platform?: string;
    country?: string;
    iat: number;
    exp: number;
    metas?: UserMetas;
}

export interface UserMetas extends AccessToken{}
