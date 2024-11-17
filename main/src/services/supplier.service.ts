import { injectable, inject } from "inversify";
import { Supplier } from "src/database/schemas";
import { ISupplierRepository } from "src/repositories";
import { INTERFACE_NAME } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";

export type CreateSupplierDto = {
  name: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  address: string;
};

export type UpdateSupplierDto = Partial<CreateSupplierDto>;

export interface ISupplierService {
  getSuppliers(): Promise<Supplier[]>;
  getOneSupplier(id: number): Promise<Supplier>;
  createSupplier(
    createSupplierDto: CreateSupplierDto,
    userId: number
  ): Promise<Supplier>;
  updateSupplier(
    id: number,
    updateSupplierDto: UpdateSupplierDto
  ): Promise<Supplier>;
  deleteSupplier(id: number): Promise<Supplier>;
}

@injectable()
export class SupplierService implements ISupplierService {
  constructor(
    @inject(INTERFACE_NAME.SupplierRepository)
    private supplierRepository: ISupplierRepository
  ) {}

  async getSuppliers(): Promise<Supplier[]> {
    try {
      return await this.supplierRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getOneSupplier(id: number): Promise<Supplier> {
    try {
      const Supplier = await this.supplierRepository.findById(id);
      if (!Supplier) {
        throw new NotFoundError(`Supplier with id ${id} not found`);
      }
      return Supplier;
    } catch (error) {
      throw error;
    }
  }

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
    userId: number
  ): Promise<Supplier> {
    try {
      return await this.supplierRepository.add({ ...createSupplierDto });
    } catch (error) {
      throw error;
    }
  }

  async updateSupplier(
    id: number,
    updateSupplierDto: UpdateSupplierDto
  ): Promise<Supplier> {
    try {
      await this.getOneSupplier(id); // Ensure Supplier exists
      return await this.supplierRepository.update(id, updateSupplierDto);
    } catch (error) {
      throw error;
    }
  }

  async deleteSupplier(id: number): Promise<Supplier> {
    try {
      await this.getOneSupplier(id); // Ensure Supplier exists
      return await this.supplierRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
