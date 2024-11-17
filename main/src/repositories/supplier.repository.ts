import { suppliers, Supplier } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

// Example for Address Repository
export interface ISupplierRepository extends IRepository<Supplier> {}

@injectable()
export class SupplierRepository
  extends Repository<Supplier>
  implements ISupplierRepository
{
  constructor() {
    super(suppliers);
  }
}
