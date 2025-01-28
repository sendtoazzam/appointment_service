import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentSchema } from './appointment.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Configs, ConfigsSchema } from '../configs/configs.model';
import { AppointmentList, AppointmentListSchema } from './appointment-list.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Appointment.name,
        schema: AppointmentSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Configs.name,
        schema: ConfigsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: AppointmentList.name,
        schema: AppointmentListSchema,
      },
    ]),
  ],
  exports: [AppointmentModule],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
