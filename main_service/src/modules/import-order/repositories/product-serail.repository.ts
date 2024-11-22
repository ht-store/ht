import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { ProductSerial, productSerials } from "src/shared/database/schemas ";
import { IProductSerialRepository } from "src/shared/interfaces/repositories";

@injectable()
export class ProductSerialRepository
  extends Repository<ProductSerial>
  implements IProductSerialRepository
{
  constructor() {
    super(productSerials);
  }
}
