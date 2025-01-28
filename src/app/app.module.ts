import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentModule } from './appointment/appointment.module';
import { ConfigsModule } from './configs/configs.module';
import { Configs, ConfigsSchema } from './configs/configs.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Configs.name,
        schema: ConfigsSchema,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    AppointmentModule,
    ConfigsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
