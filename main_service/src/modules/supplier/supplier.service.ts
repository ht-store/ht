import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { Supplier } from "src/shared/database/schemas";
import { NotFoundError } from "src/shared/errors";
import { ISupplierRepository } from "src/shared/interfaces/repositories";
import { ISupplierService } from "src/shared/interfaces/services";
import { CreateSupplierType, UpdateSupplierType } from "src/shared/types";

@injectable()
export class SupplierService implements ISupplierService {
  constructor(
    @inject(TYPES.SupplierRepository)
    private supplierRepository: ISupplierRepository
  ) {}

  async getSuppliers(): Promise<Supplier[]> {
    ``;
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
    createSupplierData: CreateSupplierType
  ): Promise<Supplier> {
    try {
      return await this.supplierRepository.add({ ...createSupplierData });
    } catch (error) {
      throw error;
    }
  }

  async updateSupplier(
    id: number,
    updateSupplierData: UpdateSupplierType
  ): Promise<Supplier> {
    try {
      await this.getOneSupplier(id); // Ensure Supplier exists
      return await this.supplierRepository.update(id, updateSupplierData);
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
