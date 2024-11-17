import { warehouses, Warehouse } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

// Example for Address Repository
export interface IWarehouseRepository extends IRepository<Warehouse> {}

@injectable()
export class WarehouseRepository
  extends Repository<Warehouse>
  implements IWarehouseRepository
{
  constructor() {
    super(warehouses);
  }
}
