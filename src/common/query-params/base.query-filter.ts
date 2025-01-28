import { BaseQueryParamDto } from './base-dto.queryparam';
import { BaseMongooseDocument } from '../model/base-mongoose-document.model';
import { Pagination } from '../pagination/pagination';
import { PaginationBuilder } from '../pagination/builder.pagination';
import { Model, PipelineStage } from 'mongoose';

/**
 * To build the query based on the query param passed in
 */
export abstract class BaseQueryFilterBuilder {
  allowLoadAll = false;

  constructor(private readonly qs: BaseQueryParamDto) {}

  id(value: string): object {
    const values = value.split(',').map((val: string) => {
      return val == 'null' ? null : val;
    });
    return {
      _id: { $in: values },
    };
  }

  /**
   * set the model query based on query params
   * @param model
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setMongooseQuery<T extends BaseMongooseDocument>(
    model: Model<T>,
    conditions?: object,
  ) {
    const whereConditions: object = {
      $and: [{ $or: [{ deleted: false }, { deleted: null }] }],
      ...conditions,
      ...this.getWhere(),
    };

    const query = model
      .find(whereConditions)
      .skip(this.getSkip())
      .limit(this.getLimit())
      .sort(this.getOrderBy());

    return query;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  aggregateMongooseQuery<T extends BaseMongooseDocument>(
    model: Model<T>,
    conditions?: PipelineStage[],
  ) {
    const whereConditions: object = {
      $and: [{ $or: [{ deleted: false }, { deleted: null }] }],
      ...this.getWhere(),
    };

    conditions.push(
      {
        $match: whereConditions,
      },
      {
        $sort: this.getOrderBy(),
      },
      {
        $skip: this.getSkip(),
      },
    );
    if (this.getLimit() > 0) {
      conditions.push({
        $limit: this.getLimit(),
      });
    }

    return model.aggregate(conditions);
  }

  getQs(): BaseQueryParamDto {
    return this.qs;
  }

  /**
   * to check if request return pagination meta in query param
   */
  hasPaginationMeta(): boolean {
    return this.qs?.paginationMeta === 'true';
  }

  async getPagination<T extends BaseMongooseDocument>(
    model: Model<T>,
    conditions?: object,
  ): Promise<Pagination> {
    const query = this.setMongooseQuery(model, conditions);

    query.skip(0);
    query.limit(0);

    const total = await query.count();

    return PaginationBuilder.build(total, this.getQs());
  }

  async getAggregatePagination<T extends BaseMongooseDocument>(
    model: Model<T>,
    conditions?: PipelineStage[],
  ): Promise<Pagination> {
    const whereConditions: object = {
      $and: [{ $or: [{ deleted: false }, { deleted: null }] }],
      ...this.getWhere(),
    };

    conditions.push(
      {
        $match: whereConditions,
      },
      {
        $sort: this.getOrderBy(),
      },
    );
    const query = await model.aggregate(conditions);

    const total = query.length;

    return PaginationBuilder.build(total, this.getQs());
  }

  /**
   * return conditions
   */
  protected getWhere(): object {
    const conditions = {};
    Object.keys(this.qs || {}).forEach((key: string | number) => {
      if (this[key]) {
        Object.assign(conditions, this[key](this.qs[key]));
      }
    });

    return conditions;
  }

  /**
   * get ordering
   */
  protected getOrderBy(): any {
    if (this.qs?.orderBy) {
      const isLatest = this.qs.orderBy.startsWith('-');
      let columnName = isLatest
        ? this.qs.orderBy.substring(1)
        : this.qs.orderBy;

      // special handilng for mongodb
      if (columnName === 'id') {
        columnName = '_id';
      }

      return {
        [columnName]: isLatest ? -1 : 1,
      };
    } else {
      // default will be order by publishedAt desc
      return {
        publishedAt: -1,
      };
    }
  }

  /**
   * calculate many records to skip based on the limit per page and current page request
   */
  protected getSkip(): number {
    if (this.qs?.limit === 0) {
      return 0;
    }

    const skip = (this.qs?.page - 1) * (this.qs?.limit || 1);

    return skip < 0 ? 0 : skip;
  }

  /**
   * what are the fields to return
   */
  protected getFields(): string[] {
    return this.qs?.fields?.split(',');
  }

  protected getLimit(): number {
    if (this.qs?.limit === 0 && this.allowLoadAll) {
      return null;
    }
    return this.qs?.limit || 30;
  }
}
