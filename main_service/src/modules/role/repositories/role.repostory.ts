import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { Role, roles } from "src/shared/database/schemas";
import { IRoleRepository } from "src/shared/interfaces/repositories";

@injectable()
export class RoleRepository
  extends Repository<Role>
  implements IRoleRepository
{
  constructor() {
    super(roles);
  }
}
