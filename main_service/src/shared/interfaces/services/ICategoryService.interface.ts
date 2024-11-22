import { Category } from "src/shared/database/schemas";
import { CreateCategoryType, UpdateCategoryType } from "src/shared/types";

export interface ICategoryService {
  getCategories(): Promise<Category[]>;
  getOneCategory(id: number): Promise<Category>;
  createCategory(
    createCategoryData: CreateCategoryType,
    userId: number
  ): Promise<Category>;
  updateCategory(
    id: number,
    updateCategoryData: UpdateCategoryType
  ): Promise<Category>;
  deleteCategory(id: number): Promise<Category>;
}
