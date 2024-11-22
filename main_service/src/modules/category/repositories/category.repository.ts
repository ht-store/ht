import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { categories, Category } from "src/shared/database/schemas ";
import { ICategoryRepository } from "src/shared/interfaces/repositories";

@injectable()
export class CategoryRepository
  extends Repository<Category>
  implements ICategoryRepository
{
  constructor() {
    super(categories);
  }
}
