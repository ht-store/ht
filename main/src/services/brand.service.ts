import { injectable, inject } from "inversify";
import { Brand } from "src/database/schemas";
import { IBrandRepository } from "src/repositories/brand.repository";
import { INTERFACE_NAME } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";

export type CreateBrandDto = {
  name: string;
};

export type UpdateBrandDto = {
  name?: string;
};

export interface IBrandService {
  getBrands(): Promise<Brand[]>;
  getOneBrand(id: number): Promise<Brand>;
  createBrand(createBrandDto: CreateBrandDto, userId: number): Promise<Brand>;
  updateBrand(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand>;
  deleteBrand(id: number): Promise<Brand>;
}

@injectable()
export class BrandService implements IBrandService {
  constructor(
    @inject(INTERFACE_NAME.BrandRepository)
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
    createBrandDto: CreateBrandDto,
    userId: number
  ): Promise<Brand> {
    try {
      return await this.brandRepository.add({ ...createBrandDto });
    } catch (error) {
      throw error;
    }
  }

  async updateBrand(
    id: number,
    updateBrandDto: UpdateBrandDto
  ): Promise<Brand> {
    try {
      await this.getOneBrand(id); // Ensure brand exists
      return await this.brandRepository.update(id, updateBrandDto);
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
