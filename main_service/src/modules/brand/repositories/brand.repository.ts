import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { Brand, brands } from "src/shared/database/schemas ";
import { IBrandRepository } from "src/shared/interfaces/repositories";

@injectable()
export class BrandRepository
  extends Repository<Brand>
  implements IBrandRepository
{
  constructor() {
    super(brands);
  }
}
