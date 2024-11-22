import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { ImportOrder, importOrders } from "src/shared/database/schemas ";
import { IImportOrderRepository } from "src/shared/interfaces/repositories";

@injectable()
export class ImportOrderRepository
  extends Repository<ImportOrder>
  implements IImportOrderRepository
{
  constructor() {
    super(importOrders);
  }
}
