import { Module } from '@nestjs/common';
import { LoggerService } from 'nest-logger';
import { CustomLogger } from './logger.service';

@Module({
    providers: [
        {
            provide: CustomLogger,
            useFactory: (): LoggerService => {
                const logLevel =
                    process.env.NODE_ENV !== 'production' ||
                    process.env.DEBUG === 'true'
                        ? 'debug'
                        : 'info';
                const loggers = [
                    LoggerService.console({
                        timeFormat: 'dd/MM/YYYY HH:mm:ss',
                        consoleOptions: {
                            level: logLevel,
                        },
                    }),
                ];

                return new CustomLogger(logLevel, loggers);
            },
        },
    ],
    exports: [CustomLogger],
})
export class LoggerModule {}
