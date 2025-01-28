import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsDateString, IsString, IsNumber } from "class-validator";
import { BaseQueryParamDto } from "src/common/query-params/base-dto.queryparam";
import { Appointment } from "../../appointment.model";
import { AppointmentDTO } from "../appointment.dto";

export class GetSlotResponseDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  available_slots: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  maxSlots: number;

  static fromModel(model: AppointmentDTO): GetSlotResponseDTO {
    const dto = new GetSlotResponseDTO();
    dto.date = model.date;
    dto.time = model.time;
    dto.available_slots = model.available_slots;

    return dto;
  }
}