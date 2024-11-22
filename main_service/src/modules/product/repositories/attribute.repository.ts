import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { Attribute, attributes } from "src/shared/database/schemas";
import { IAttributeRepository } from "src/shared/interfaces/repositories";

@injectable()
export class AttributeRepository
  extends Repository<Attribute>
  implements IAttributeRepository
{
  constructor() {
    super(attributes);
  }
}
