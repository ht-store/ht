import { Supplier } from "src/shared/database/schemas";
import { CreateSupplierType, UpdateSupplierType } from "src/shared/types";

export interface ISupplierService {
  getSuppliers(): Promise<Supplier[]>;
  getOneSupplier(id: number): Promise<Supplier>;
  createSupplier(createSupplierData: CreateSupplierType): Promise<Supplier>;
  updateSupplier(
    id: number,
    updateSupplierData: UpdateSupplierType
  ): Promise<Supplier>;
  deleteSupplier(id: number): Promise<Supplier>;
}
