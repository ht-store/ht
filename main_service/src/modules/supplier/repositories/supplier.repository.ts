import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { Supplier, suppliers } from "src/shared/database/schemas";
import { ISupplierRepository } from "src/shared/interfaces/repositories";

@injectable()
export class SupplierRepository
  extends Repository<Supplier>
  implements ISupplierRepository
{
  constructor() {
    super(suppliers);
  }
}
