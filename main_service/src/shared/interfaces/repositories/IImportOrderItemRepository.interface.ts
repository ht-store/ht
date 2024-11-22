import { ImportOrderItem } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";

export interface IImportOrderItemRepository
  extends IRepository<ImportOrderItem> {
  findByImportOrderId(importOrderId: number): Promise<ImportOrderItem[]>;
}
