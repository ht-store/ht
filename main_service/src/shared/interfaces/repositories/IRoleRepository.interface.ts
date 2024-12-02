import { Role } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IRoleRepository extends IRepository<Role> {}
