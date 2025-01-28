import { threadId } from 'worker_threads';
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestLogService } from '../request-log/request-log.service';
@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
    private static threadIdCounter: number = 0;

    constructor(
        private readonly requestLogService: RequestLogService,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const ip =
            request.headers['x-forwarded-for'] ??
            request.connection.remoteAddress;
        const ips: string = ip
            .split(', ')[0]
            ?.replace(/\./g, '-')
            ?.replace(/\::/g, '-');

        const now = Date.now();

        return next.handle().pipe(
            catchError((error: unknown) => {
                // log unsuccessful request respons
                if (process.env.REQUEST_LOG === 'true') {
                    const payload = {
                        status: false,
                        endpoint: {
                            method: request['method'],
                            path: request['path'],
                        },
                        request: request['body'],
                        response: error['response'],
                        createdBy: request['user'],
                    };

                    this.requestLogService.createRequestLog(payload);
                }

                throw error;
            }),
            tap((data: unknown) => {
                const delay = Date.now() - now;
                if (process.env.REQUEST_LOG === 'true') {
                    const payload = {
                        status: true,
                        endpoint: {
                            method: request['method'],
                            path: request['path'],
                        },
                        request: request['body'],
                        response: data,
                        createdBy: request['user'],
                    };

                    this.requestLogService.createRequestLog(payload);
                }

                return data;
            }),
        );
    }
}
