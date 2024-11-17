import { injectable, inject } from "inversify";
import { Warehouse } from "src/database/schemas";
import { IWarehouseRepository } from "src/repositories";
import { INTERFACE_NAME } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";

export type CreateWarehouseDto = {
  name: string;
  location: string;
  capacity: number;
};

export type UpdateWarehouseDto = Partial<CreateWarehouseDto>;

export interface IWarehouseService {
  getWarehouses(): Promise<Warehouse[]>;
  getOneWarehouse(id: number): Promise<Warehouse>;
  createWarehouse(
    createWarehouseDto: CreateWarehouseDto,
    userId: number
  ): Promise<Warehouse>;
  updateWarehouse(
    id: number,
    updateWarehouseDto: UpdateWarehouseDto
  ): Promise<Warehouse>;
  deleteWarehouse(id: number): Promise<Warehouse>;
}

@injectable()
export class WarehouseService implements IWarehouseService {
  constructor(
    @inject(INTERFACE_NAME.WarehouseRepository)
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
    createWarehouseDto: CreateWarehouseDto,
    userId: number
  ): Promise<Warehouse> {
    try {
      return await this.warehouseRepository.add({ ...createWarehouseDto });
    } catch (error) {
      throw error;
    }
  }

  async updateWarehouse(
    id: number,
    updateWarehouseDto: UpdateWarehouseDto
  ): Promise<Warehouse> {
    try {
      await this.getOneWarehouse(id); // Ensure Warehouse exists
      return await this.warehouseRepository.update(id, updateWarehouseDto);
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
