/* eslint-disable @typescript-eslint/naming-convention */
import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import { RedisService } from './redis.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'idempotency',
        }),
        CacheModule.registerAsync<RedisClientOptions>({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              store: await redisStore({
                ttl: 60000,
                url: `redis://:${
                  configService.get('QUEUE_AUTH') || ''
                }@${configService.get('QUEUE_HOST')}:${configService.get(
                  'QUEUE_PORT'
                )}/${configService.get('QUEUE_DB') || 1}`,
              }),
            }),
          }),
        
    ],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}
