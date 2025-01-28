import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongooseDocument } from 'src/common/model/base-mongoose-document.model';
import { AppointmentDetails } from './embedded-model/appointment-details.embedded-model';

@Schema({
  timestamps: true,
})
export class AppointmentList extends BaseMongooseDocument {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true, default: [] })
  slots: AppointmentDetails[];
}

export const AppointmentListSchema = SchemaFactory.createForClass(AppointmentList);
