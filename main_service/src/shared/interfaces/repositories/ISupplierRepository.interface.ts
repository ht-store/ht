import { Supplier } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface ISupplierRepository extends IRepository<Supplier> {}
