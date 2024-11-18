import { inject, injectable } from "inversify";
import { ImportOrder, ImportOrderItem } from "src/database/schemas";
import {
  IImportOrderItemRepository,
  IImportOrderRepository,
  IOrderRepository,
} from "src/repositories";
import { INTERFACE_NAME } from "src/shared/constants";

export interface IImportOrderService {
  createImportOrder(
    supplierId: number,
    items: { skuId: number; quantity: number; price: number }[]
  ): Promise<void>;

  getImportOrders(): Promise<ImportOrder[]>;

  getImportOrderById(orderId: number): Promise<ImportOrder | null>;

  updateOrderStatus(orderId: number, status: string): Promise<ImportOrder>;
}

@injectable()
export class ImportOrderService {
  constructor(
    @inject(INTERFACE_NAME.ImportOrderRepository)
    private readonly importOrderRepository: IImportOrderRepository,
    @inject(INTERFACE_NAME.ImportOrderItemRepository)
    private readonly importOrderItemRepository: IImportOrderItemRepository
  ) {}

  // Tạo đơn đặt hàng mới
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
    console.log(items);
    for (const item of items) {
      await this.importOrderItemRepository.add({
        skuId: item.skuId,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        totalPrice: (item.price * item.quantity).toFixed(2),
        importOrderId: importOrder.id,
      });
    }
  }
  // Lấy danh sách đơn đặt hàng
  async getImportOrders(): Promise<ImportOrder[]> {
    return this.importOrderRepository.findAll();
  }

  // Lấy chi tiết đơn đặt hàng theo ID
  async getImportOrderById(orderId: number): Promise<ImportOrder | null> {
    return this.importOrderRepository.findById(orderId);
  }

  // Cập nhật tình trạng đơn hàng
  async updateOrderStatus(
    orderId: number,
    status: string
  ): Promise<ImportOrder> {
    return this.importOrderRepository.update(orderId, { status });
  }
}
