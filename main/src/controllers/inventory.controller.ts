import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IInventoryService, IImportOrderService } from "src/services";
import { INTERFACE_NAME } from "src/shared/constants";
import { BadRequestError, NotFoundError } from "src/shared/errors";

@injectable()
export class InventoryController {
  constructor(
    @inject(INTERFACE_NAME.InventoryService)
    private inventoryService: IInventoryService,

    @inject(INTERFACE_NAME.ImportOrderService)
    private importOrderService: IImportOrderService
  ) {}

  // API: Tạo đơn đặt hàng
  async createImportOrder(req: Request, res: Response): Promise<void> {
    try {
      const { supplierId, items } = req.body;
      if (!supplierId || !items || !Array.isArray(items)) {
        res.status(400).json({ message: "Invalid input data" });
        return;
      }

      // Tạo đơn đặt hàng
      const order = await this.importOrderService.createImportOrder(
        supplierId,
        items
      );
      res
        .status(201)
        .json({ message: "Import order created successfully", order });
    } catch (error) {
      console.error("Error creating import order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // API: Lấy danh sách đơn đặt hàng
  async getImportOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.importOrderService.getImportOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // API: Lấy chi tiết đơn đặt hàng
  async getImportOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        throw new BadRequestError("Order ID is required.");
      }

      const order = await this.importOrderService.getImportOrderById(
        parseInt(orderId)
      );
      if (!order) {
        throw new NotFoundError("Order not found.");
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // API: Nhập kho từ một đơn đặt hàng
  async importStock(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, items, importDate } = req.body;

      if (!orderId || !items || !importDate) {
        res.status(400).json({ message: "Invalid input data" });
        return;
      }

      // Nhập kho từ đơn đặt hàng
      await this.inventoryService.importStock(orderId, items, importDate);
      res.status(200).json({ message: "Stock imported successfully" });
    } catch (error) {
      console.error("Error importing stock:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // API: Xuất kho từ một đơn đặt hàng
  async exportStock(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, items, exportDate } = req.body;

      if (!orderId || !items || !exportDate) {
        res.status(400).json({ message: "Invalid input data" });
        return;
      }

      // Xuất kho từ đơn đặt hàng
      await this.inventoryService.exportStock(orderId, items, exportDate);
      res.status(200).json({ message: "Stock exported successfully" });
    } catch (error) {
      console.error("Error exporting stock:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
