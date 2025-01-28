import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthIndicatorResult,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongooseHealth: MongooseHealthIndicator, // NOTE: enable this if using mongodb
  ) {}

  @Public()
  @Get()
  async index(): Promise<HealthCheckResult> {
    return this.health.check([
      (): Promise<HealthIndicatorResult> =>
        this.mongooseHealth.pingCheck('mongodb'),
    ]);
  }
}
