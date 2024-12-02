import { injectable, inject } from "inversify";
import { TYPES } from "src/shared/constants";
import { Role, CreateRole } from "src/shared/database/schemas";
import { NotFoundError } from "src/shared/errors";
import { IRoleRepository } from "src/shared/interfaces/repositories";
import { IRoleService } from "src/shared/interfaces/services";
import { CreateRoleType, UpdateRoleType } from "src/shared/types";

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(TYPES.RoleRepository)
    private roleRepository: IRoleRepository
  ) {}

  async getRoles(): Promise<Role[]> {
    try {
      return await this.roleRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getOneRole(id: number): Promise<Role> {
    try {
      const Role = await this.roleRepository.findById(id);
      if (!Role) {
        throw new NotFoundError(`Role with id ${id} not found`);
      }
      return Role;
    } catch (error) {
      throw error;
    }
  }

  async createRole(
    createRoleData: CreateRoleType,
    userId: number
  ): Promise<Role> {
    try {
      return await this.roleRepository.add({ ...createRoleData });
    } catch (error) {
      throw error;
    }
  }

  async updateRole(
    id: number,
    updateRoleData: UpdateRoleType
  ): Promise<Role> {
    try {
      await this.getOneRole(id); // Ensure Role exists
      return await this.roleRepository.update(id, updateRoleData);
    } catch (error) {
      throw error;
    }
  }

  async deleteRole(id: number): Promise<Role> {
    try {
      await this.getOneRole(id); // Ensure Role exists
      return await this.roleRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
