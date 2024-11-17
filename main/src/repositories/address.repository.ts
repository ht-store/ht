import { Address, addresses } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

// Example for Address Repository
export interface IAddressRepository extends IRepository<Address> {}

@injectable()
export class AddressRepository
  extends Repository<Address>
  implements IAddressRepository
{
  constructor() {
    super(addresses);
  }
}
