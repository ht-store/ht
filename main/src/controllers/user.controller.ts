import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { INTERFACE_NAME, STATUS_CODES } from "src/shared/constants";
import logger from "src/utils/logger";
import { BaseResponse } from "src/shared/types/baseResponse";
import { UpdateUserDto } from "src/dtos";
import { IUserService } from "src/services/user.service";

@injectable()
export class UserController {
  constructor(
    @inject(INTERFACE_NAME.UserService) private userService: IUserService
  ) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.getAllUsers();
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get all users successfully", data));
    } catch (error) {
      logger.error("Get all users error", error);
      next(error);
    }
  }

  async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.getAllUsers();
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get all users successfully", data));
    } catch (error) {
      logger.error("Get all users error", error);
      next(error);
    }
  }

  async getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.getAllUsers();
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get all users successfully", data));
    } catch (error) {
      logger.error("Get all users error", error);
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      const data = await this.userService.getUserById(userId);
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get user successfully", data));
    } catch (error) {
      logger.error("Get user error", error);
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      const updateData = <UpdateUserDto>req.body;
      const data = await this.userService.updateUser(userId, updateData);
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Update user successfully", data));
    } catch (error) {
      logger.error("Update user error", error);
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      const data = await this.userService.deleteUser(userId);
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Delete user successfully", data));
    } catch (error) {
      logger.error("Delete user error", error);
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId; // From authenticated user
      const updateData = <UpdateUserDto>req.body;
      const data = await this.userService.updateUser(userId, updateData);
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Update profile successfully", data));
    } catch (error) {
      logger.error("Update profile error", error);
      next(error);
    }
  }
}
