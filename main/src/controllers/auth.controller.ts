import { injectable, inject } from "inversify";
import { IAuthService } from "src/services";
import { INTERFACE_NAME, STATUS_CODES } from "src/shared/constants";
import { Request, Response, NextFunction } from "express";
import logger from "src/utils/logger";
import { BaseResponse } from "src/shared/types/baseResponse";
import { LoginDto, RegisterDto } from "src/dtos";
import { EventEmitter } from "events";
@injectable()
export class AuthController {
  constructor(
    @inject(INTERFACE_NAME.AuthService) private authService: IAuthService
  ) {}

  async resigter(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <RegisterDto>req.body;
      const data = await this.authService.register(body);
      const response = {
        success: true,
        message: "Register successfully",
        data,
      };
      return res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
      logger.error("Register User Error", error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <LoginDto>req.body;
      const data = await this.authService.login(body);
      const response = {
        success: true,
        message: "Login successfully",
        data,
      };
      // this.cartWorker.handleUserLogin(response.data.userId);
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Login Error", error);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const data = await this.authService.logout(userId);
      const response = {
        success: true,
        message: "Logout successfully",
        data,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Logout error", error);
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.query.refresh_token as string;
      const data = await this.authService.refreshToken(
        req.userId,
        refreshToken,
        req.roleId
      );
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Refresh token successfully", data));
    } catch (error) {
      logger.error("Refresh token error", error);
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const data = await this.authService.me(userId);
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Refresh token successfully", data));
    } catch (error) {
      logger.error("Refresh token error", error);
      next(error);
    }
  }
}
