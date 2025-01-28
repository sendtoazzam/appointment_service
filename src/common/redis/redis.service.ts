import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {  Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        @InjectQueue('idempotency')
        private redisQueue: Queue,
    ) {}

    get(key: string): Promise<unknown> {
        return this.cache.get(key);
    }

    getByKeys(key: string): Promise<unknown[]> {
        return this.cache.store.keys(key);
      }

    async set(
        key: string,
        value: unknown,
        ttl?: number
    ): Promise<void> {
    await this.cache.set(key, value, ttl);
    }

    async reset(): Promise<void> {
        await this.cache.reset();
    }

    async del(key: string): Promise<void> {
        await this.cache.del(key);
    }

    async delByKey(key: string | string[]): Promise<void> {
        const keys = await this.getByKeys(key as string);
        await Promise.all(
            keys.map(async (v: string) => {
                await this.cache.del(v);
            }),
        );
    }

    async processQueue(key: string, data: unknown): Promise<boolean> {
        const redisQueue = await this.redisQueue.add(
            {
                key,
                data,
            },
            {
                removeOnComplete: 30,
                removeOnFail: false,
                attempts: 1,
            },
        );
        return redisQueue.finished();
    }
}
