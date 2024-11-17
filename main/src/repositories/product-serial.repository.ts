import { productSerials, ProductSerial } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

export interface IProductSerialRepository extends IRepository<ProductSerial> {}

@injectable()
export class ProductSerialRepository
  extends Repository<ProductSerial>
  implements IProductSerialRepository
{
  constructor() {
    super(productSerials);
  }
}
