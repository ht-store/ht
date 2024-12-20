import { Address } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IAddressRepository extends IRepository<Address> {
  findByUserId(userId: number): Promise<Address | null >
}
