import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamDto } from 'src/common/query-params/base-dto.queryparam';

export class ConfigsRequestDTO extends BaseQueryParamDto {
  @ApiProperty({ required: false })
  id: string;

  @ApiProperty({ required: false })
  createdBy: number;
}
