import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import {
  CreateBrandDto,
  IBrandService,
  UpdateBrandDto,
} from "src/services/brand.service";
import { INTERFACE_NAME, STATUS_CODES } from "src/shared/constants"; // Adjust path as per your application structure
import { NotFoundError } from "src/shared/errors"; // Adjust path as per your application structure
import logger from "src/utils/logger";

@injectable()
export class BrandController {
  constructor(
    @inject(INTERFACE_NAME.BrandService) private brandService: IBrandService // Adjust interface and injection key as per your application setup
  ) {}

  async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await this.brandService.getBrands();
      const response = {
        success: true,
        message: "Get brands is successful",
        data: brands,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Get Brands failed", error);
      next(error);
    }
  }

  async getBrand(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const brand = await this.brandService.getOneBrand(id);
      const response = {
        success: true,
        message: "Get brand is successful",
        data: brand,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Get Brand with id ${id} failed`, error);
      next(error);
    }
  }

  async createBrand(req: Request, res: Response, next: NextFunction) {
    const createBrandDto = <CreateBrandDto>req.body;
    const userId = req.userId; // Assuming you have userId in request, adjust as per your authentication setup
    try {
      const newBrand = await this.brandService.createBrand(
        createBrandDto,
        userId
      );
      const response = {
        success: true,
        message: "Create brand is successful",
        data: newBrand,
      };
      return res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
      logger.error("Create Brand failed", error);
      next(error);
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const updateBrandDto = <UpdateBrandDto>req.body;
    try {
      const updatedBrand = await this.brandService.updateBrand(
        id,
        updateBrandDto
      );
      const response = {
        success: true,
        message: "Update brand is successful",
        data: updatedBrand,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Update Brand with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedBrand = await this.brandService.deleteBrand(id);
      const response = {
        success: true,
        message: "Delete brand is successful",
        data: deletedBrand,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Delete Brand with id ${id} failed`, error);
      next(error);
    }
  }
}
