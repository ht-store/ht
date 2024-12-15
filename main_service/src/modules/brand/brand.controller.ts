import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { STATUS_CODES, TYPES } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";
import { IBrandService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";
import { CreateBrandDto, UpdateBrandDto } from "./dtos";
import { BaseResponse } from "src/common/responses";

@injectable()
export class BrandController {
  constructor(
    @inject(TYPES.BrandService) private brandService: IBrandService // Adjust interface and injection key as per your application setup
  ) {}

  async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await this.brandService.getBrands();
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get brands is successful", brands));
    } catch (error) {
      logger.error("Get Brands failed", error);
      next(error);
    }
  }

  async getBrand(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const brand = await this.brandService.getOneBrand(id);
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get brand is successful", brand));
    } catch (error) {
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
      return res
        .status(STATUS_CODES.CREATED)
        .json(BaseResponse.success("Create brand is successful", newBrand));
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
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Update brand is successful", updatedBrand));
    } catch (error) {
      logger.error(`Update Brand with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedBrand = await this.brandService.deleteBrand(id);
      return res
        .status(STATUS_CODES.OK)
        .json(
          BaseResponse.success("Delete brand is successfull", deletedBrand)
        );
    } catch (error) {
      logger.error(`Delete Brand with id ${id} failed`, error);
      next(error);
    }
  }
}
