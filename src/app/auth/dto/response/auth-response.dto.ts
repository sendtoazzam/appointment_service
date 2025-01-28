import { ApiProperty } from '@nestjs/swagger';
import { UserTypeEnum } from '../../enum/user-type.enum';

export class LoginResponseDto {
  @ApiProperty()
  isSuperAdmin: boolean;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;

  @ApiProperty({
    description: 'JWT token with 7 days lifetime',
  })
  accessToken: string;

  @ApiProperty()
  platform: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  userType?: UserTypeEnum;

  constructor(
    accessToken: string,
    user: {
      userId: number;
      username: string;
      platform: string;
      country: string;
      role: string;
    },
  ) {
    this.accessToken = accessToken;
    this.role = this.userType;
    this.isSuperAdmin = this.userType === UserTypeEnum.Admin ? true : false;
    this.country = process.env.APP_COUNTRY ?? 'MY';
    this.userId = user.userId;
    this.platform = user.platform;
    this.username = user.username;
  }
}
