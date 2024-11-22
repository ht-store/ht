import { injectable, inject } from "inversify";
import { TYPES } from "src/shared/constants";
import { Category } from "src/shared/database/schemas ";
import { NotFoundError } from "src/shared/errors";
import { ICategoryRepository } from "src/shared/interfaces/repositories";
import { ICategoryService } from "src/shared/interfaces/services";
import { CreateCategoryType, UpdateCategoryType } from "src/shared/types";

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(TYPES.CategoryRepository)
    private categoryRepository: ICategoryRepository
  ) {}

  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getOneCategory(id: number): Promise<Category> {
    try {
      const Category = await this.categoryRepository.findById(id);
      if (!Category) {
        throw new NotFoundError(`Category with id ${id} not found`);
      }
      return Category;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryType
  ): Promise<Category> {
    try {
      return await this.categoryRepository.add(createCategoryDto);
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryType
  ): Promise<Category> {
    try {
      await this.getOneCategory(id); // Ensure Category exists
      return await this.categoryRepository.update(id, updateCategoryDto);
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<Category> {
    try {
      await this.getOneCategory(id); // Ensure Category exists
      return await this.categoryRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
