import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import {
  CreateRoleDto,
  IRoleService,
  UpdateRoleDto,
} from "src/services/role.service";
import { INTERFACE_NAME, STATUS_CODES } from "src/shared/constants"; // Adjust path as per your application structure
import { NotFoundError } from "src/shared/errors"; // Adjust path as per your application structure
import logger from "src/utils/logger";

@injectable()
export class RoleController {
  constructor(
    @inject(INTERFACE_NAME.RoleService) private roleService: IRoleService // Adjust interface and injection key as per your application setup
  ) {}

  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const Roles = await this.roleService.getRoles();
      const response = {
        success: true,
        message: "Get Roles is successful",
        data: Roles,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Get Roles failed", error);
      next(error);
    }
  }

  async getRole(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const Role = await this.roleService.getOneRole(id);
      const response = {
        success: true,
        message: "Get Role is successful",
        data: Role,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Get Role with id ${id} failed`, error);
      next(error);
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    const createRoleDto = <CreateRoleDto>req.body;
    const userId = req.userId; // Assuming you have userId in request, adjust as per your authentication setup
    try {
      const newRole = await this.roleService.createRole(createRoleDto, userId);
      const response = {
        success: true,
        message: "Create Role is successful",
        data: newRole,
      };
      return res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
      logger.error("Create Role failed", error);
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const updateRoleDto = <UpdateRoleDto>req.body;
    try {
      const updatedRole = await this.roleService.updateRole(id, updateRoleDto);
      const response = {
        success: true,
        message: "Update Role is successful",
        data: updatedRole,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Update Role with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedRole = await this.roleService.deleteRole(id);
      const response = {
        success: true,
        message: "Delete Role is successful",
        data: deletedRole,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Delete Role with id ${id} failed`, error);
      next(error);
    }
  }
}
