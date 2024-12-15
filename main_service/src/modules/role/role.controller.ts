import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { STATUS_CODES, TYPES } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";
import { IRoleService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";
import { CreateRoleDto, UpdateRoleDto } from "./dtos";
import { BaseResponse } from "src/common/responses";

@injectable()
export class RoleController {
  constructor(
    @inject(TYPES.RoleService) private roleService: IRoleService // Adjust interface and injection key as per your application setup
  ) {}

  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const Roles = await this.roleService.getRoles();
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get Roles is successful", Roles));
    } catch (error) {
      logger.error("Get Roles failed", error);
      next(error);
    }
  }

  async getRole(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const Role = await this.roleService.getOneRole(id);
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get Role is successful", Role));
    } catch (error) {
      logger.error(`Get Role with id ${id} failed`, error);
      next(error);
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    const createRoleDto = <CreateRoleDto>req.body;
    const userId = req.userId; // Assuming you have userId in request, adjust as per your authentication setup
    try {
      const newRole = await this.roleService.createRole(
        createRoleDto,
        userId
      );
      return res
        .status(STATUS_CODES.CREATED)
        .json(BaseResponse.success("Create Role is successful", newRole));
    } catch (error) {
      logger.error("Create Role failed", error);
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const updateRoleDto = <UpdateRoleDto>req.body;
    try {
      const updatedRole = await this.roleService.updateRole(
        id,
        updateRoleDto
      );
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Update Role is successful", updatedRole));
    } catch (error) {
      logger.error(`Update Role with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedRole = await this.roleService.deleteRole(id);
      return res
        .status(STATUS_CODES.OK)
        .json(
          BaseResponse.success("Delete Role is successfull", deletedRole)
        );
    } catch (error) {
      logger.error(`Delete Role with id ${id} failed`, error);
      next(error);
    }
  }
}
