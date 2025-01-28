import { BaseQueryParamDto } from '../query-params/base-dto.queryparam';
import { Pagination } from './pagination';

export class PaginationBuilder {
  static build(
    totalRecords: number,
    queryParam: BaseQueryParamDto,
  ): Pagination {
    return {
      limit: queryParam.limit,
      current: queryParam.page,
      totalItems: totalRecords,
      totalPages: Math.ceil(totalRecords / queryParam.limit),
    };
  }
}
