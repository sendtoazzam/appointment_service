import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRequestLogDTO } from '../dto/create-request-log.dto';
import { RequestLogs } from '../model/request-logs.model';

@Injectable()
export class RequestLogService {
    constructor(
        @InjectModel(RequestLogs.name)
        private readonly requestLogsModel: Model<RequestLogs>,
    ) {}

    async createRequestLog(dto: CreateRequestLogDTO): Promise<void> {
        await this.requestLogsModel.create(dto);
    }
}
