import { Role, CreateRole } from "src/shared/database/schemas";

export interface IRoleService {
  getRoles(): Promise<Role[]>;
  getOneRole(id: number): Promise<Role>;
  createRole(createRoleData: CreateRole, userId: number): Promise<Role>;
  updateRole(
    id: number,
    createRoleData: Partial<CreateRole>
  ): Promise<Role>;
  deleteRole(id: number): Promise<Role>;
}
