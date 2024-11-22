import { ImportOrder, ImportOrderItem } from "src/shared/database/schemas";
import {
  CreateImportOrderItemResponseType,
  CreateImportOrderType,
  DetailOrderItemType,
} from "src/shared/types";

export interface IImportOrderService {
  createImportOrder(
    data: CreateImportOrderType
  ): Promise<CreateImportOrderItemResponseType>;
  getImportOrders(): Promise<ImportOrder[]>;
  getImportOrderItems(importId: number): Promise<ImportOrderItem[]>;
  getDetailImportOrder(itemId: number): Promise<DetailOrderItemType>;
}
