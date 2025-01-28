import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sha512crypt } from 'shacrypt';
import { Users } from './users.model';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/response/auth-response.dto';
import { LoginRequestDto } from './dto/request/auth-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { UserLogs } from './logs.model';
import { UserAlreadyRegister } from './exception/user-exist.exception';
import { GeneralValidationException } from 'src/common/exception/general-validation.exception';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { UserTypeEnum } from './enum/user-type.enum';

@Injectable()
export class AuthService {
  private readonly salt: string = 'r4z0rg4d3';
  private readonly rounds: number = 9564;

  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    @InjectModel(UserLogs.name) private readonly userLogsModel: Model<UserLogs>,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(
    dto: LoginRequestDto,
    headers: object,
  ): Promise<LoginResponseDto> {
    const encryptedPassword = this.encryptPassword(dto.password);

    let query: object;

    if (dto.username) {
      query = {
        username: dto.username,
      };
    } else {
      query = {
        email: dto.email,
      };
    }

    const user = await this.usersModel.findOne(query);

    if (!user) throw new UserNotFoundException();

    if (encryptedPassword !== user?.password) {
      throw new GeneralValidationException(
        `password_not_same`,
        `Wrong password.`,
      );
    }

    const accessToken = this.jwtService.sign({
      username: user.username,
      userId: user._id,
      role: user.userType === UserTypeEnum.Admin ? true : false,
      platform: 'APP',
      country: process.env.APP_COUNTRY,
      isSuperAdmin: user.userType === UserTypeEnum.Admin ? true : false,
    });

    await this.userLogsModel.create({
      userInfo: user,
      header: headers,
      token: accessToken,
    });

    return {
      userId: user._id,
      username: user.username ?? user.email,
      role: user?.userType,
      platform: 'APP',
      country: process.env.APP_COUNTRY,
      isSuperAdmin: user.userType === UserTypeEnum.Admin ? true : false,
      accessToken,
    };
  }

  async register(dto: RegisterRequestDto, headers: object): Promise<string> {
    const checkUser = await this.usersModel.findOne({
      email: dto.email,
    });

    if (checkUser || dto.username === checkUser?.username) {
      throw new UserAlreadyRegister(!checkUser ? dto.username : dto.email);
    }

    if (dto.password !== dto.confirmPassword) {
      throw new GeneralValidationException(
        `password_not_same`,
        `Confirm Password must be same as password.`,
      );
    }

    const createUser = await this.usersModel.create({
      username: dto?.username,
      email: dto?.email,
      userType: UserTypeEnum.User,
      password: this.encryptPassword(dto.password),
    });

    if (createUser) {
      await this.userLogsModel.create({
        userInfo: createUser,
        header: headers,
      });
      return `Registeration of user ${dto?.email || dto?.username} Successful`;
    }
    return 'Unable to register user';
  }

  private encryptPassword(plainPassword: string): string {
    return sha512crypt(plainPassword, this.salt, this.rounds).replace(
      /^[\$rounds=956430rgdz]*/,
      '',
    );
  }
}
