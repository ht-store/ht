import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { Warehouse, warehouses } from "src/shared/database/schemas ";
import { IWarehouseRepository } from "src/shared/interfaces/repositories";

// Example for Address Repository

@injectable()
export class WarehouseRepository
  extends Repository<Warehouse>
  implements IWarehouseRepository
{
  constructor() {
    super(warehouses);
  }
}
