import { ImportOrderItem, importOrderItems } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

export interface IImportOrderItemRepository
  extends IRepository<ImportOrderItem> {}

@injectable()
export class ImportOrderItemRepository
  extends Repository<ImportOrderItem>
  implements IImportOrderItemRepository
{
  constructor() {
    super(importOrderItems);
  }
}
