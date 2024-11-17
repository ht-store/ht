import { Brand, brands } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

export interface IBrandRepository extends IRepository<Brand> {}

@injectable()
export class BrandRepository
  extends Repository<Brand>
  implements IBrandRepository
{
  constructor() {
    super(brands);
  }
}
