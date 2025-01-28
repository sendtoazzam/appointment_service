import { BaseQueryFilterBuilder } from 'src/common/query-params/base.query-filter';

export class ConfigsQueryFilter extends BaseQueryFilterBuilder {
  createdBy(value: string): object {
    return {
      createdBy: {
        userId: value,
      },
    };
  }
}
