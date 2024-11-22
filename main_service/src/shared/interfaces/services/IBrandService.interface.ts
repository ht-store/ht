import { Brand, CreateBrand } from "src/shared/database/schemas ";

export interface IBrandService {
  getBrands(): Promise<Brand[]>;
  getOneBrand(id: number): Promise<Brand>;
  createBrand(createBrandData: CreateBrand, userId: number): Promise<Brand>;
  updateBrand(
    id: number,
    createBrandData: Partial<CreateBrand>
  ): Promise<Brand>;
  deleteBrand(id: number): Promise<Brand>;
}
