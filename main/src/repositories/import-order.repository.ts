import { ImportOrder, importOrders } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

// Example for Address Repository
export interface IImportOrderRepository extends IRepository<ImportOrder> {}

@injectable()
export class ImportOrderRepository
  extends Repository<ImportOrder>
  implements IImportOrderRepository
{
  constructor() {
    super(importOrders);
  }
}
