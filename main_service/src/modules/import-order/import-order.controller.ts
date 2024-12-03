import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES, STATUS_CODES } from "src/shared/constants";
import { logger } from "src/shared/middlewares";
import { IImportOrderService } from "src/shared/interfaces/services";
import { CreateImportOrderDto } from "./dtos";

@injectable()
export class ImportOrderController {
  constructor(
    @inject(TYPES.ImportOrderService)
    private importOrderService: IImportOrderService
  ) {}

  // Tạo đơn nhập hàng mới
  async createImportOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <CreateImportOrderDto>req.body;
      console.log(req.body);
      const importOrder = await this.importOrderService.createImportOrder(body);

      return res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: "Import order created successfully.",
        data: importOrder,
      });
    } catch (error) {
      logger.error("Error in createImportOrder", error);
      next(error);
    }
  }

  // Lấy danh sách đơn nhập hàng
  async getImportOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const importOrders = await this.importOrderService.getImportOrders();

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Import orders retrieved successfully.",
        data: importOrders,
      });
    } catch (error) {
      logger.error("Error in getImportOrders", error);
      next(error);
    }
  }

  // Lấy chi tiết các mặt hàng trong đơn nhập
  async getImportOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const importId = +req.params.id;
      const items = await this.importOrderService.getImportOrderItems(importId);

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Import order items retrieved successfully.",
        data: items,
      });
    } catch (error) {
      logger.error("Error in getImportOrderItems", error);
      next(error);
    }
  }

  // Lấy chi tiết một mặt hàng nhập
  async getDetailImportOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const itemId = +req.params.itemId;
      const item = await this.importOrderService.getDetailImportOrder(itemId);

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Import order item detail retrieved successfully.",
        data: item,
      });
    } catch (error) {
      logger.error("Error in getDetailImportOrder", error);
      next(error);
    }
  }
}
