import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongooseDocument } from 'src/common/model/base-mongoose-document.model';

@Schema({
  timestamps: true,
})
export class UserLogs extends BaseMongooseDocument {
  @Prop({
    type: Object,
  })
  userInfo: object;

  @Prop({
    type: Object,
  })
  headers?: object;

  @Prop()
  token: string;
}

export const UserLogsSchema = SchemaFactory.createForClass(UserLogs);
