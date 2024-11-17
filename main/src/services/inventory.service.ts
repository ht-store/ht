import { inject, injectable } from "inversify";
import { Inventory, StockMovement } from "src/database/schemas";
import {
  IImportOrderItemRepository,
  IImportOrderRepository,
  IInventoryRepository,
  IStockMovementRepository,
} from "src/repositories";
import { INTERFACE_NAME } from "src/shared/constants";

export interface IInventoryService {
  importStock(
    importOrderId: number,
    items: { skuId: number; quantity: number; price: number }[],
    importDate: string
  ): Promise<void>;
  createImportOrder(
    supplierId: number,
    items: { skuId: number; quantity: number; price: number }[]
  ): Promise<void>;
}

@injectable()
export class InventoryService implements IInventoryService {
  constructor(
    @inject(INTERFACE_NAME.InventoryRepository)
    private inventoryRepository: IInventoryRepository,
    @inject(INTERFACE_NAME.StockMovementRepository)
    private stockMovementRepository: IStockMovementRepository,
    @inject(INTERFACE_NAME.ImportOrderRepository)
    private importOrderRepository: IImportOrderRepository,
    @inject(INTERFACE_NAME.ImportOrderItemRepository)
    private importOrderItemRepository: IImportOrderItemRepository
  ) {}

  async importStock(
    importOrderId: number,
    items: { skuId: number; quantity: number; price: number }[],
    importDate: string
  ) {
    for (const item of items) {
      // Cập nhật tồn kho cho mỗi SKU trong order
      await this.inventoryRepository.updateQuanity(
        item.skuId,
        importOrderId,
        item.quantity
      );

      // Ghi nhận lịch sử nhập hàng vào kho
      await this.stockMovementRepository.add({
        skuId: item.skuId,
        warehouseId: importOrderId,
        movementType: "IMPORT",
        quantity: item.quantity,
        referenceId: importOrderId,
        movementDate: new Date(importDate),
      });
    }
  }

  async createImportOrder(
    supplierId: number,
    items: { skuId: number; quantity: number; price: number }[]
  ): Promise<void> {
    const importOrder = await this.importOrderRepository.add({
      supplierId,
      orderDate: new Date().toISOString(),
      status: "pending",
      totalAmount: items
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2),
    });

    for (const item of items) {
      await this.importOrderItemRepository.add({
        skuId: item.skuId,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        totalPrice: (item.price * item.quantity).toFixed(2),
        importOrderId: importOrder.id,
      });
    }

    // Nhập kho dựa trên order
    await this.importStock(importOrder.id, items, importOrder.orderDate);
  }
}
