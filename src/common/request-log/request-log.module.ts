import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLogs, requestLogsSchema } from '../model/request-logs.model';
import { RequestLogService } from './request-log.service';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: RequestLogs.name,
                schema: requestLogsSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [RequestLogService],
    exports: [RequestLogService],
})
export class RequestLogModule {}
