import { Repository, Model } from 'sequelize-typescript';
import { Includeable, WhereOptions, Order, WhereOperators, FindOptions } from 'sequelize/types';
import { Fn } from 'sequelize/types/lib/utils';
import { Base } from '../../database/base';

export class RootService<T extends Model<T>>{
  protected readonly defaultPaginationLimit = 10;

  constructor(protected readonly model: Repository<T>) { }
  protected createWhereOptions = (option: IPropOption<T>) => ({ [option.prop]: option.value });

  findOneByProp = async (option: IPropOption<T>, include?: Includeable[]) => {
    const result = await this.model.findOne({ include, where: this.createWhereOptions(option) });
    return result ? result.get({ plain: true }) as T : null;
  }

  findManyByProp = async (option: IPropOption<T>, include?: Includeable[]) => {
    const result = await this.model.findAll({ include, where: this.createWhereOptions(option) });
    return result.map((item) => item.get({ plain: true })) as T[];
  }

  findAll = async (options: FindOptions): Promise<T[]> => {
    const result = await this.model.findAll(options);
    return result.map((e) => e.get({ plain: true })) as T[];
  }

  async add<TInterface extends Object>(model: TInterface) {
    const result = await this.model.create(model);
    return result ? result.get({ plain: true }) as T : null;
  }

  protected getValidPageNumber(page: number, totalPages: number) {
    let thePage = page || 1;
    thePage = (thePage > totalPages)
      ? totalPages : ((thePage <= 0) ? 1 : thePage);
    return thePage;
  }

  protected async getPaginationOptions (options: IPaginationOptions) {
    const {
      where = {}, include = [], order = [], group = undefined, subQuery = false,
    } = options.defaultOptions || { };
    const count = await this.model.count({ where });

    const { limit = this.defaultPaginationLimit } = options;
    const totalPages = Math.ceil(count / limit) || 1;
    const currentPage = this.getValidPageNumber(options.page, totalPages);
    const offset = (currentPage - 1) * limit;
    return {
      dbOptions: { where, include, order, offset, limit, group, subQuery },
      meta: { totalPages, limit, count, page: currentPage },
    };
  }

  async getPaginated(options: IPaginationOptions) {
    const pageOptions = await this.getPaginationOptions(options);
    const result = await this.model.findAll(pageOptions.dbOptions);
    return new PagedResult(result.map((entry) => entry.get() as T), pageOptions.meta);
  }
}

export class BaseService<T extends Base<T>, TId extends string | number>
  extends RootService<T> implements IModelService<T, TId> {
  // constructor(protected readonly model: Repository<T>) { }

  constructor(model: Repository<T>) {
    super(model);
  }

  findById = async (id: TId, include?: Includeable[], attributes?: string[]): Promise<T> => {
    const result = await this.model.findByPk(id, { include, attributes });
    return result ? result.get({ plain: true }) as T : null;
  }

  protected shouldReturnUpdated(returning: IReturningOptions) {
    return returning && returning.returning;
  }

  async update(id: TId, data: any, returning?: IReturningOptions) {
    const [, [result]] = await this.model.update({ ...data }, {
      where: { id },
      returning: true,
    });

    if (!this.shouldReturnUpdated(returning)) return result.get() as T;
    const updatedResult = await this.findById(id, returning.include);
    return updatedResult;
  }
}

export interface IPropOption<T> {
  prop: keyof T;
  value: any;
}

export interface IPaginationOptions {
  defaultOptions?: IFindOptions;
  limit?: number;
  page?: number;
}

export class PagedResult<T extends Model<T>> {
  constructor(
    public readonly data: T[],
    public readonly pageMeta: {
      page: number;
      totalPages: number;
      limit: number;
      count: number;
    }) { }
}

export interface IFindOptions {
  where?: WhereOptions;
  include?: Includeable[];
  order?: Order;
  attributes?: (string | (string | Fn)[])[] | { exclude: string[] };
  group?: string[];
  subQuery?: boolean;
  limit?: number;
}

export interface IModelService<T, TId> {
  findById(id: TId, include?: Includeable[]): Promise<T>;
  findAll(filter: object): Promise<T[]>;
}

export interface IReturningOptions {
  returning: boolean;
  include?: Includeable[];
}
