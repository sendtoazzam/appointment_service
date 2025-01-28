import { ApiProperty } from "@nestjs/swagger";
import { BaseQueryParamDto } from "src/common/query-params/base-dto.queryparam";

export class SlotRequestDTO extends BaseQueryParamDto {
  @ApiProperty({ required: false })
  date: Date;
}