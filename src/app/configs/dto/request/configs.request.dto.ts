import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamDto } from 'src/common/query-params/base-dto.queryparam';
import { AuthUser } from 'src/common/type/auth-user.type';

export class ConfigsRequestDTO extends BaseQueryParamDto {
  @ApiProperty({ required: false })
  id: string;

  @ApiProperty({ required: false })
  createdBy: AuthUser;
}
