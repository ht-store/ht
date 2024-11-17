import { injectable, inject } from "inversify";
import { Category } from "src/database/schemas";
import { ICategoryRepository } from "src/repositories/category.repository";
import { INTERFACE_NAME } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";

export type CreateCategoryDto = {
  name: "mobile_phone" | "tablet";
};

export type UpdateCategoryDto = {
  name?: "mobile_phone" | "tablet";
};

export interface ICategoryService {
  getCategories(): Promise<Category[]>;
  getOneCategory(id: number): Promise<Category>;
  createCategory(
    createCategoryDto: CreateCategoryDto,
    userId: number
  ): Promise<Category>;
  updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category>;
  deleteCategory(id: number): Promise<Category>;
}

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(INTERFACE_NAME.CategoryRepository)
    private CategoryRepository: ICategoryRepository
  ) {}

  async getCategories(): Promise<Category[]> {
    try {
      return await this.CategoryRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getOneCategory(id: number): Promise<Category> {
    try {
      const Category = await this.CategoryRepository.findById(id);
      if (!Category) {
        throw new NotFoundError(`Category with id ${id} not found`);
      }
      return Category;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    try {
      return await this.CategoryRepository.add(createCategoryDto);
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    try {
      await this.getOneCategory(id); // Ensure Category exists
      return await this.CategoryRepository.update(id, updateCategoryDto);
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<Category> {
    try {
      await this.getOneCategory(id); // Ensure Category exists
      return await this.CategoryRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
