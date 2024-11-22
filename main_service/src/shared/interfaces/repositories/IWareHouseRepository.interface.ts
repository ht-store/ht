import { Warehouse } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";

export interface IWarehouseRepository extends IRepository<Warehouse> {}
