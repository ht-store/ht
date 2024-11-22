import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { ImportOrderService } from "./import-order.service";
import { CreateImportOrderType } from "src/shared/types";
import { BaseResponse } from "src/common/responses";
import { BadRequestError } from "src/shared/errors";

@injectable()
export class ImportOrderController {
  constructor(
    @inject(TYPES.ImportOrderService)
    private importOrderService: ImportOrderService
  ) {}

  // Create Import Order
  async createImportOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateImportOrderType = req.body; // Assuming body is already validated
      const result = await this.importOrderService.createImportOrder(data);
      return res
        .status(201)
        .json(BaseResponse.success("Create import order success", result)); // Return created resource
    } catch (error) {
      next(error);
    }
  }

  // Get All Import Orders
  async getImportOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.importOrderService.getImportOrders();
      return res
        .status(200)
        .json(BaseResponse.success("Get all import orders success", result));
    } catch (error) {
      next(error);
    }
  }

  // Get Import Order Items
  async getImportOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const importId = parseInt(req.params.importId, 10);
      if (isNaN(importId)) {
        throw new BadRequestError("Invalid import ID");
      }
      const result =
        await this.importOrderService.getImportOrderItems(importId);
      return res
        .status(200)
        .json(BaseResponse.success("Get import order items success", result));
    } catch (error) {
      next(error);
    }
  }

  // Get Detail of Import Order Item
  async getDetailImportOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const itemId = parseInt(req.params.itemId, 10);
      if (isNaN(itemId)) {
        throw new BadRequestError("Invalid import ID");
      }
      const result = await this.importOrderService.getDetailImportOrder(itemId);
      return res
        .status(200)
        .json(BaseResponse.success("Get import order detail success", result));
    } catch (error) {
      next(error);
    }
  }
}
