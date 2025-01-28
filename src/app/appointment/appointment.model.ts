import { AuthUser } from './../../common/type/auth-user.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsObject } from 'class-validator';
import { BaseMongooseDocument } from 'src/common/model/base-mongoose-document.model';
import { AppointmentStatus } from './enum/appointment-status.enum';
import { AuthUserType } from 'src/common/enum/auth-user-type.enum';

@Schema({
  timestamps: true,
})
export class Appointment extends BaseMongooseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, default: null })
  email: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ default: 1 })
  maxSlots: number;

  @Prop({ default: 1 })
  slotsBooked: number;

  @Prop({ default: AppointmentStatus.PENDING })
  appointmentStatus: AppointmentStatus;

  @Prop({ default: null })
  cancelledAt: Date;

  @Prop({
    type: IsObject,
    default: null
  })
  cancelledBy: AuthUser;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
