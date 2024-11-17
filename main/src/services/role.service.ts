import { injectable, inject } from "inversify";
import { Role } from "src/database/schemas";
import { IRoleRepository } from "src/repositories/role.repository";
import { INTERFACE_NAME } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";

export type CreateRoleDto = {
  name: string;
};

export type UpdateRoleDto = {
  name?: string;
};

export interface IRoleService {
  getRoles(): Promise<Role[]>;
  getOneRole(id: number): Promise<Role>;
  createRole(createRoleDto: CreateRoleDto, userId: number): Promise<Role>;
  updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role>;
  deleteRole(id: number): Promise<Role>;
}

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(INTERFACE_NAME.RoleRepository)
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
    createRoleDto: CreateRoleDto,
    userId: number
  ): Promise<Role> {
    try {
      return await this.roleRepository.add({ ...createRoleDto });
    } catch (error) {
      throw error;
    }
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      await this.getOneRole(id); // Ensure Role exists
      return await this.roleRepository.update(id, updateRoleDto);
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
