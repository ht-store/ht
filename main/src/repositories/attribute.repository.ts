import { Attribute, addresses, attributes } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

// Example for Address Repository
export interface IAttributeRepository extends IRepository<Attribute> {}

@injectable()
export class AttributeRepository
  extends Repository<Attribute>
  implements IAttributeRepository
{
  constructor() {
    super(attributes);
  }
}
