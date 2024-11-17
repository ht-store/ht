import { SkuAttribute, skuAttributes } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

export interface ISkuAttributeRepository extends IRepository<SkuAttribute> {}

@injectable()
export class SkuAttributeRepository
  extends Repository<SkuAttribute>
  implements ISkuAttributeRepository
{
  constructor() {
    super(skuAttributes);
  }
}
