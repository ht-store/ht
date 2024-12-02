import { injectable, inject } from "inversify";
import { TYPES } from "src/shared/constants";
import { Address, CreateAddress } from "src/shared/database/schemas";
import { NotFoundError } from "src/shared/errors";
import { IAddressRepository } from "src/shared/interfaces/repositories";
import { IAddressService } from "src/shared/interfaces/services";
import { CreateAddressType, UpdateAddressType } from "src/shared/types";

@injectable()
export class AddressService implements IAddressService {
  constructor(
    @inject(TYPES.AddressRepository)
    private addressRepository: IAddressRepository
  ) {}

  async getOneAddressByUserId(userId: number): Promise<Address> {
    try {
      const address = await this.addressRepository.findByUserId(userId) 
      if (!address) {
        throw new NotFoundError('Not found')
      }
      
      return address
    } catch (error) {
      throw error;
    }
  }

  async getAddresss(): Promise<Address[]> {
    try {
      return await this.addressRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getOneAddress(id: number): Promise<Address> {
    try {
      const Address = await this.addressRepository.findById(id);
      if (!Address) {
        throw new NotFoundError(`Address with id ${id} not found`);
      }
      return Address;
    } catch (error) {
      throw error;
    }
  }

  async createAddress(
    createAddressData: CreateAddressType,
    userId: number
  ): Promise<Address> {
    try {
      return await this.addressRepository.add({ ...createAddressData });
    } catch (error) {
      throw error;
    }
  }

  async updateAddress(
    id: number,
    updateAddressData: UpdateAddressType
  ): Promise<Address> {
    try {
      await this.getOneAddress(id); // Ensure Address exists
      return await this.addressRepository.update(id, updateAddressData);
    } catch (error) {
      throw error;
    }
  }

  async deleteAddress(id: number): Promise<Address> {
    try {
      await this.getOneAddress(id); // Ensure Address exists
      return await this.addressRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
