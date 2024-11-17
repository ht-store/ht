import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import {
  CreateSupplierDto,
  ISupplierService,
  UpdateSupplierDto,
} from "src/services";
import { INTERFACE_NAME, STATUS_CODES } from "src/shared/constants"; // Adjust path as per your application structure
import { NotFoundError } from "src/shared/errors"; // Adjust path as per your application structure
import logger from "src/utils/logger";

@injectable()
export class SupplierController {
  constructor(
    @inject(INTERFACE_NAME.SupplierService)
    private supplierService: ISupplierService // Adjust interface and injection key as per your application setup
  ) {}

  async getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const Suppliers = await this.supplierService.getSuppliers();
      const response = {
        success: true,
        message: "Get Suppliers is successful",
        data: Suppliers,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Get Suppliers failed", error);
      next(error);
    }
  }

  async getSupplier(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const Supplier = await this.supplierService.getOneSupplier(id);
      const response = {
        success: true,
        message: "Get Supplier is successful",
        data: Supplier,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Get Supplier with id ${id} failed`, error);
      next(error);
    }
  }

  async createSupplier(req: Request, res: Response, next: NextFunction) {
    const createSupplierDto = <CreateSupplierDto>req.body;
    const userId = req.userId; // Assuming you have userId in request, adjust as per your authentication setup
    try {
      const newSupplier = await this.supplierService.createSupplier(
        createSupplierDto,
        userId
      );
      const response = {
        success: true,
        message: "Create Supplier is successful",
        data: newSupplier,
      };
      return res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
      logger.error("Create Supplier failed", error);
      next(error);
    }
  }

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const updateSupplierDto = <UpdateSupplierDto>req.body;
    try {
      const updatedSupplier = await this.supplierService.updateSupplier(
        id,
        updateSupplierDto
      );
      const response = {
        success: true,
        message: "Update Supplier is successful",
        data: updatedSupplier,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Update Supplier with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedSupplier = await this.supplierService.deleteSupplier(id);
      const response = {
        success: true,
        message: "Delete Supplier is successful",
        data: deletedSupplier,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Delete Supplier with id ${id} failed`, error);
      next(error);
    }
  }
}
