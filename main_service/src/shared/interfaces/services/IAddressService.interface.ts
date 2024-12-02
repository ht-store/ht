import { Address, CreateAddress } from "src/shared/database/schemas";

export interface IAddressService {
  getAddresss(): Promise<Address[]>;
  getOneAddress(id: number): Promise<Address>;
  getOneAddressByUserId(userId: number): Promise<Address>;
  createAddress(createAddressData: CreateAddress, userId: number): Promise<Address>;
  updateAddress(
    id: number,
    createAddressData: Partial<CreateAddress>
  ): Promise<Address>;
  deleteAddress(id: number): Promise<Address>;
}
