import { AuthUserType } from '../enum/auth-user-type.enum';

export type Created = {
    userId: string;
    userType: AuthUserType;
    createdAt: Date;
};
