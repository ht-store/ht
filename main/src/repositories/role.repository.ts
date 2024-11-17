import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import { IRepository, Repository } from "./repository";
import { Role, roles } from "src/database/schemas";

export interface IRoleRepository extends IRepository<Role> {}

@injectable()
export class RoleRepository
  extends Repository<Role>
  implements IRoleRepository
{
  constructor() {
    super(roles);
  }
}
