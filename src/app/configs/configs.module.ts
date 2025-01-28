import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/Config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigsController } from './configs.controller';
import { Configs, ConfigsSchema } from './configs.model';
import { ConfigsService } from './configs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Configs.name,
        schema: ConfigsSchema,
      },
    ]),
  ],
  exports: [ConfigsModule],
  controllers: [ConfigsController],
  providers: [ConfigsService]
})
export class ConfigsModule { }
