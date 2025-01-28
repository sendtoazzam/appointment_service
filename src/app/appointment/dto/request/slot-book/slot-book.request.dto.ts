import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseQueryParamDto } from "src/common/query-params/base-dto.queryparam";

export class SlotBookRequestDTO extends BaseQueryParamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;
}