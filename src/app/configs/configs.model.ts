import { AuthUser } from '../../common/type/auth-user.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsObject } from 'class-validator';
import { BaseMongooseDocument } from 'src/common/model/base-mongoose-document.model';
import { AuthUserType } from 'src/common/enum/auth-user-type.enum';
import { AppointmentConfigs } from './embedded-model/appointment-configs.embedded-model';

@Schema({
  timestamps: true,
})
export class Configs extends BaseMongooseDocument {
  @Prop({
    required: true,
    default: null
  })
  appointmentConfigs: AppointmentConfigs;

  @Prop({
    type: IsObject,
    default: {
      userId: null,
      type: AuthUserType.System,
    }
  })
  createdBy: AuthUser;
}

export const ConfigsSchema = SchemaFactory.createForClass(Configs);
