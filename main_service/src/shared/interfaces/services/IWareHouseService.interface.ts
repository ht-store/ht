import { Warehouse } from "src/shared/database/schemas ";
import { CreateWarehouseType, UpdateWarehouseType } from "src/shared/types";

export interface IWarehouseService {
  getWarehouses(): Promise<Warehouse[]>;
  getOneWarehouse(id: number): Promise<Warehouse>;
  createWarehouse(
    createWarehouseData: CreateWarehouseType,
    userId: number
  ): Promise<Warehouse>;
  updateWarehouse(
    id: number,
    updateWarehouseData: UpdateWarehouseType
  ): Promise<Warehouse>;
  deleteWarehouse(id: number): Promise<Warehouse>;
}
