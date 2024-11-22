import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { Warehouse } from "src/shared/database/schemas ";
import { NotFoundError } from "src/shared/errors";
import { IWarehouseRepository } from "src/shared/interfaces/repositories";
import { IWarehouseService } from "src/shared/interfaces/services";
import { CreateWarehouseType, UpdateWarehouseType } from "src/shared/types";

@injectable()
export class WarehouseService implements IWarehouseService {
  constructor(
    @inject(TYPES.WarehouseRepository)
    private warehouseRepository: IWarehouseRepository
  ) {}

  async getWarehouses(): Promise<Warehouse[]> {
    try {
      return await this.warehouseRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getOneWarehouse(id: number): Promise<Warehouse> {
    try {
      const Warehouse = await this.warehouseRepository.findById(id);
      if (!Warehouse) {
        throw new NotFoundError(`Warehouse with id ${id} not found`);
      }
      return Warehouse;
    } catch (error) {
      throw error;
    }
  }

  async createWarehouse(
    createWarehouseData: CreateWarehouseType,
    userId: number
  ): Promise<Warehouse> {
    try {
      return await this.warehouseRepository.add({ ...createWarehouseData });
    } catch (error) {
      throw error;
    }
  }

  async updateWarehouse(
    id: number,
    updateWarehouseData: UpdateWarehouseType
  ): Promise<Warehouse> {
    try {
      await this.getOneWarehouse(id); // Ensure Warehouse exists
      return await this.warehouseRepository.update(id, updateWarehouseData);
    } catch (error) {
      throw error;
    }
  }

  async deleteWarehouse(id: number): Promise<Warehouse> {
    try {
      await this.getOneWarehouse(id); // Ensure Warehouse exists
      return await this.warehouseRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
