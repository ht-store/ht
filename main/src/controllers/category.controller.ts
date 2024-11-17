import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import {
  CreateCategoryDto,
  ICategoryService,
  UpdateCategoryDto,
} from "src/services/category.service";
import { INTERFACE_NAME, STATUS_CODES } from "src/shared/constants"; // Adjust path as per your application structure
import { NotFoundError } from "src/shared/errors"; // Adjust path as per your application structure
import logger from "src/utils/logger";
@injectable()
export class CategoryController {
  constructor(
    @inject(INTERFACE_NAME.CategoryService)
    private categoryService: ICategoryService // Adjust interface and injection key as per your application setup
  ) {}

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.getCategories();
      const response = {
        success: true,
        message: "Get categories is successful",
        data: categories,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Get Categories failed", error);
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const category = await this.categoryService.getOneCategory(id);
      const response = {
        success: true,
        message: "Get category is successful",
        data: category,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Get Category with id ${id} failed`, error);
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    const createCategoryDto = <CreateCategoryDto>req.body;
    const userId = req.userId; // Assuming you have userId in request, adjust as per your authentication setup
    try {
      const newCategory = await this.categoryService.createCategory(
        createCategoryDto,
        userId
      );
      const response = {
        success: true,
        message: "Create category is successful",
        data: newCategory,
      };
      return res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
      logger.error("Create Category failed", error);
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const updateCategoryDto = <UpdateCategoryDto>req.body;
    try {
      const updatedCategory = await this.categoryService.updateCategory(
        id,
        updateCategoryDto
      );
      const response = {
        success: true,
        message: "Update category is successful",
        data: updatedCategory,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Update Category with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedCategory = await this.categoryService.deleteCategory(id);
      const response = {
        success: true,
        message: "Delete category is successful",
        data: deletedCategory,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Delete Category with id ${id} failed`, error);
      next(error);
    }
  }
}
