import { warranties, Warranty } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

export interface IWarrantyRepository extends IRepository<Warranty> {}

@injectable()
export class WarrantyRepository
  extends Repository<Warranty>
  implements IWarrantyRepository
{
  constructor() {
    super(warranties);
  }
}
