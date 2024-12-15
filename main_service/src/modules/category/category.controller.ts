import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { STATUS_CODES, TYPES } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";
import { ICategoryService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";
import { CreateCategoryDto, UpdateCategoryDto } from "./dtos";

export class CategoryController {
  constructor(
    @inject(TYPES.CategoryService)
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
      logger.error(`Delete Category with id ${id} failed`, error);
      next(error);
    }
  }
}
