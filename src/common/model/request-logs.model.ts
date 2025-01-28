import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Created } from '../type/created.type';
import { Endpoint } from '../type/endpoint.type';
import { BaseMongooseDocument } from './base-mongoose-document.model';

@Schema({
    timestamps: true,
})
export class RequestLogs extends BaseMongooseDocument {
    @Prop({ type: 'boolean' })
    status: boolean;

    @Prop({ type: 'object' })
    endpoint: Endpoint;

    @Prop({ type: 'object' })
    request: object;

    @Prop({ type: 'object' })
    response: object;

    @Prop({ type: 'object' })
    createdBy: Created;
}

export const requestLogsSchema = SchemaFactory.createForClass(RequestLogs);
