import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthUserType } from 'src/common/enum/auth-user-type.enum';
import { Configs } from './configs/configs.model';
import { Days } from 'src/common/enum/days.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Configs.name) private readonly configModel: Model<Configs>,
  ) { }

  // onModuleInit() is executed before the app bootstraped
  async onModuleInit() {
    try {
      //generate default configurations
      const ConfigurationModel = this.constructor as Model<Configs>;
      const exist = await this.configModel.find({ appointmentConfigs: { $exists: true } });
      if (exist.length === 0) {
        await this.configModel.insertMany([
          {
            appointmentConfigs: {
              slotDuration: 30,
              maxSlotPerAppointment: 1,
              operationHours: {
                start: '08:00',
                end: '17:00',
              },
              unavailableHours: [
                { "day": Days.Monday, "hours": ["12:00-13:00"] }
              ],
              holidays: ["2024-04-01", "2024-05-01"],
            },
            createdBy: { userId: null, type: AuthUserType.System }
          }
        ]);
      }
    } catch (error) {
      throw error;
    }
  }
}
