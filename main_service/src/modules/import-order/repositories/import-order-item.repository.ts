import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import {
  ImportOrder,
  ImportOrderItem,
  importOrderItems,
  importOrders,
} from "src/shared/database/schemas ";
import {
  IImportOrderItemRepository,
  IImportOrderRepository,
} from "src/shared/interfaces/repositories";

@injectable()
export class ImportOrderItemRepository
  extends Repository<ImportOrderItem>
  implements IImportOrderItemRepository
{
  constructor() {
    super(importOrderItems);
  }

  async findByImportOrderId(importOrderId: number): Promise<ImportOrderItem[]> {
    return this.db
      .select()
      .from(importOrderItems)
      .where(eq(importOrderItems.importOrderId, importOrderId));
  }
}
