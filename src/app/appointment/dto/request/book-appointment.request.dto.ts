import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsDateString, IsString } from "class-validator";
import { BaseQueryParamDto } from "src/common/query-params/base-dto.queryparam";

export class BookAppointmentDTO extends BaseQueryParamDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDateString()
  date: string;


  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  time: string;
}