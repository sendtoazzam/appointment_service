import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseMongooseDocument } from 'src/common/model/base-mongoose-document.model';

export class AppointmentDTO extends BaseMongooseDocument {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsNumber()
  available_slots: number;
}

