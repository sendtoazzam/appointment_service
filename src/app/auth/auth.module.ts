import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, usersSchema } from './users.model';
import { UserLogs, UserLogsSchema } from './logs.model';
import { JwtModule } from '@nestjs/jwt';
import { JWT as JwtConfig } from '../../common/config/jwt';
import { JwtStrategy } from '../../common/config/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: usersSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: UserLogs.name,
        schema: UserLogsSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => JwtConfig.config,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
