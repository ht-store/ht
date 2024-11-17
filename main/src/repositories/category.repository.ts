import { categories, Category } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

export interface ICategoryRepository extends IRepository<Category> {}

@injectable()
export class CategoryRepository
  extends Repository<Category>
  implements ICategoryRepository
{
  constructor() {
    super(categories);
  }
}
