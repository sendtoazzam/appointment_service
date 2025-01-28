import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export abstract class BaseQueryParamDto {
  @ApiProperty({ required: false })
  @IsOptional()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  page = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  limit = 30;

  @ApiProperty({ required: false })
  @IsOptional()
  orderBy = '-id';

  @ApiProperty({ required: false })
  @IsOptional()
  fields: string;

  @ApiProperty({ required: false })
  @IsOptional()
  from: string;

  @ApiProperty({ required: false })
  @IsOptional()
  to: string;

  @ApiProperty({ required: false })
  @IsOptional()
  paginationMeta: string;
}
