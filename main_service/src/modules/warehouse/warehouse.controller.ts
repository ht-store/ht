import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { STATUS_CODES, TYPES } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";
import { IWarehouseService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";
import { CreateWarehouseDto, UpdateWarehouseDto } from "./dtos";

@injectable()
export class WarehouseController {
  constructor(
    @inject(TYPES.WarehouseService)
    private warehouseService: IWarehouseService // Adjust interface and injection key as per your application setup
  ) {}

  async getWarehouses(req: Request, res: Response, next: NextFunction) {
    try {
      const Warehouses = await this.warehouseService.getWarehouses();
      const response = {
        success: true,
        message: "Get Warehouses is successful",
        data: Warehouses,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Get Warehouses failed", error);
      next(error);
    }
  }

  async getWarehouse(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const Warehouse = await this.warehouseService.getOneWarehouse(id);
      const response = {
        success: true,
        message: "Get Warehouse is successful",
        data: Warehouse,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error(`Get Warehouse with id ${id} failed`, error);
      next(error);
    }
  }

  async createWarehouse(req: Request, res: Response, next: NextFunction) {
    const createWarehouseDto = <CreateWarehouseDto>req.body;
    const userId = req.userId; // Assuming you have userId in request, adjust as per your authentication setup
    try {
      const newWarehouse = await this.warehouseService.createWarehouse(
        createWarehouseDto,
        userId
      );
      const response = {
        success: true,
        message: "Create Warehouse is successful",
        data: newWarehouse,
      };
      return res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
      logger.error("Create Warehouse failed", error);
      next(error);
    }
  }

  async updateWarehouse(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const updateWarehouseDto = <UpdateWarehouseDto>req.body;
    try {
      const updatedWarehouse = await this.warehouseService.updateWarehouse(
        id,
        updateWarehouseDto
      );
      const response = {
        success: true,
        message: "Update Warehouse is successful",
        data: updatedWarehouse,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error(`Update Warehouse with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteWarehouse(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedWarehouse = await this.warehouseService.deleteWarehouse(id);
      const response = {
        success: true,
        message: "Delete Warehouse is successful",
        data: deletedWarehouse,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error(`Delete Warehouse with id ${id} failed`, error);
      next(error);
    }
  }
}
