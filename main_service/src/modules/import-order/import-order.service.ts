import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { v4 as uuidv4 } from "uuid";
import {
  ImportOrder,
  ImportOrderItem,
  ProductSerialData,
} from "src/shared/database/schemas";
import { IImportOrderService } from "src/shared/interfaces/services";
import {
  CreateImportOrderType,
  CreateImportOrderItemResponseType,
  DetailOrderItemType,
} from "src/shared/types";
import { ImportOrderRepository } from "./repositories/import-order.repository";
import {
  IImportOrderItemRepository,
  IInventoryRepository,
  IProductSerialRepository,
  ISkuRepository,
  IStockMovementRepository,
} from "src/shared/interfaces/repositories";
import { NotFoundError } from "src/shared/errors";

@injectable()
export class ImportOrderService implements IImportOrderService {
  constructor(
    @inject(TYPES.ImportOrderRepository)
    private importOrderRepository: ImportOrderRepository,
    @inject(TYPES.ImportOrderItemRepository)
    private importOrderItemRepository: IImportOrderItemRepository,
    @inject(TYPES.SkuRepository)
    private skuRepository: ISkuRepository,
    @inject(TYPES.InventoryRepository)
    private inventoryRepository: IInventoryRepository,
    @inject(TYPES.StockMovementRepository)
    private stockMovementRepository: IStockMovementRepository,
    @inject(TYPES.ProductSerialRepository)
    private productSerialRepository: IProductSerialRepository
  ) {}

  async createImportOrder(
    data: CreateImportOrderType
  ): Promise<CreateImportOrderItemResponseType> {
    try {
      const orderDate =
        data.importDate || new Date().toISOString().split("T")[0];
      const { importOrderItems } = data;
      const totalAmount = importOrderItems
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
        .toFixed(2)
      const order = await this.importOrderRepository.add({
        orderDate: orderDate,
        supplierId: data.supplierId,
        status: data.status,
        totalAmount,
      });

      const items = await Promise.all(
        importOrderItems.map(async (item) => {
          const { skuId, quantity, unitPrice } = item;
          const itemOrder = await this.importOrderItemRepository.add({
            importOrderId: order.id,
            skuId,
            quantity,
            price: unitPrice.toFixed(2),
            totalPrice: (quantity * unitPrice).toFixed(2),
          });
          return itemOrder;
        })
      );

      await this.importStock(order.id, items, data.importDate);
      return {
        ...order,
        items,
      };
    } catch (error) {
      throw error;
    }
  }

  async getImportOrders(): Promise<ImportOrder[]> {
    try {
      return await this.importOrderRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getImportOrderItems(importId: number): Promise<ImportOrderItem[]> {
    try {
      return await this.importOrderItemRepository.findByImportOrderId(importId);
    } catch (error) {
      throw error;
    }
  }

  async getDetailImportOrder(itemId: number): Promise<DetailOrderItemType> {
    try {
      const item = await this.importOrderItemRepository.findById(itemId);
      if (!item) {
        throw new NotFoundError("Import order item not found");
      }
      const sku = await this.skuRepository.findById(item.skuId!);
      return {
        ...item,
        detail: sku!,
      };
    } catch (error) {
      throw error;
    }
  }

  private async importStock(
    importOrderId: number,
    items: { skuId: number; quantity: number; price: string }[],
    importDate: string
  ) {
    for (const item of items) {
      // Cập nhật tồn kho cho mỗi SKU trong order
      await this.inventoryRepository.updateQuanity(
        item.skuId,
        1,
        item.quantity
      );

      // Ghi nhận lịch sử nhập hàng vào kho
      await this.stockMovementRepository.add({
        skuId: item.skuId,
        warehouseId: 1,
        movementType: "IMPORT",
        quantity: item.quantity,
        referenceId: importOrderId,
        movementDate: new Date(importDate),
      });

      // Tạo serials cho sản phẩm
      const currentDate = new Date();
      const dateFormatted = currentDate
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "");

      const { skuId, quantity } = item;

      for (let i = 0; i < quantity; i++) {
        const serialNumber = uuidv4(); // Tạo UUID duy nhất
        await this.productSerialRepository.add({
          skuId,
          serialNumber,
          status: "inventory", // Mặc định là "inventory" khi nhập kho
        });
      }

      // Lưu serial vào cơ sở dữ liệu
    }
  }
}
