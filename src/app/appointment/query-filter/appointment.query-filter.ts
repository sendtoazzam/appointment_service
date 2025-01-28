import { BaseQueryFilterBuilder } from 'src/common/query-params/base.query-filter';

export class SlotQueryFilter extends BaseQueryFilterBuilder {
  createdBy(value: string): object {
    return {
      date: value,
    };
  }
}
