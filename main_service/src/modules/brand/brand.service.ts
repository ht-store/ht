import { injectable, inject } from "inversify";
import { TYPES } from "src/shared/constants";
import { Brand, CreateBrand } from "src/shared/database/schemas ";
import { NotFoundError } from "src/shared/errors";
import { IBrandRepository } from "src/shared/interfaces/repositories";
import { IBrandService } from "src/shared/interfaces/services";
import { CreateBrandType, UpdateBrandType } from "src/shared/types";

@injectable()
export class BrandService implements IBrandService {
  constructor(
    @inject(TYPES.BrandRepository)
    private brandRepository: IBrandRepository
  ) {}

  async getBrands(): Promise<Brand[]> {
    try {
      return await this.brandRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getOneBrand(id: number): Promise<Brand> {
    try {
      const brand = await this.brandRepository.findById(id);
      if (!brand) {
        throw new NotFoundError(`Brand with id ${id} not found`);
      }
      return brand;
    } catch (error) {
      throw error;
    }
  }

  async createBrand(
    createBrandData: CreateBrandType,
    userId: number
  ): Promise<Brand> {
    try {
      return await this.brandRepository.add({ ...createBrandData });
    } catch (error) {
      throw error;
    }
  }

  async updateBrand(
    id: number,
    updateBrandData: UpdateBrandType
  ): Promise<Brand> {
    try {
      await this.getOneBrand(id); // Ensure brand exists
      return await this.brandRepository.update(id, updateBrandData);
    } catch (error) {
      throw error;
    }
  }

  async deleteBrand(id: number): Promise<Brand> {
    try {
      await this.getOneBrand(id); // Ensure brand exists
      return await this.brandRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
