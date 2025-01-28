import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongooseDocument } from 'src/common/model/base-mongoose-document.model';
import { UserTypeEnum } from './enum/user-type.enum';
import { UserRoleEnum } from './enum/user-role.enum';

@Schema({
  timestamps: true,
})
export class Users extends BaseMongooseDocument {
  @Prop()
  userId: number;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop({
    enum: UserTypeEnum,
    default: UserTypeEnum.User,
  })
  userType: UserTypeEnum;

  @Prop({
    enum: UserRoleEnum,
    default: UserRoleEnum.PublicUser,
  })
  role: UserRoleEnum;

  @Prop()
  password: string;

  @Prop()
  lastLogin: Date;
}

export const usersSchema = SchemaFactory.createForClass(Users);
