import { inject, injectable } from "inversify";
import { User } from "src/database/schemas";
import { IUserRepository } from "src/repositories/user.repository";
import { INTERFACE_NAME } from "src/shared/constants";
import { UserRoles } from "src/shared/enums";
import { BadRequestError, NotFoundError } from "src/shared/errors";
import { TokenType } from "src/shared/types";
import {
  compareHash,
  hash,
  signAccessToken,
  signRefreshToken,
} from "src/utils/helper";
import { ICartService } from "./cart.service";
import { ICartRepository } from "src/repositories";

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  roleId: number;
};

export type LoginResponse = TokenType & {
  userId: number;
};

export interface IAuthService {
  register(registerData: RegisterData): Promise<User>;
  login(loginData: LoginData): Promise<LoginResponse>;
  logout(userId: number): Promise<boolean>;
  refreshToken(
    userId: number,
    refreshToken: string,
    roleId: number
  ): Promise<TokenType>;
  me(userId: number): Promise<User>;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(INTERFACE_NAME.UserRepository)
    private userRepository: IUserRepository,
    @inject(INTERFACE_NAME.CartRepository)
    private cartRepository: ICartRepository
  ) {}

  async register(registerData: RegisterData): Promise<User> {
    try {
      const emailExisted = await this.userRepository.findByEmail(
        registerData.email
      );
      if (emailExisted) {
        throw new BadRequestError(
          "Email has been used to register another account"
        );
      }

      const phoneExisted = await this.userRepository.findByPhoneNumber(
        registerData.phoneNumber
      );
      if (phoneExisted) {
        throw new BadRequestError(
          "Phone number has been used to register another account"
        );
      }

      registerData.password = await hash(registerData.password);
      const user = await this.userRepository.add({
        ...registerData,
        rt: null,
        stripeId: null,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    try {
      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user) {
        throw new BadRequestError("Email is incorrect");
      }

      const matchPassword = await compareHash(
        loginData.password,
        user.password
      );
      if (!matchPassword) {
        throw new BadRequestError("Password is incorrect");
      }

      const token = this.generateToken(user.id, user.roleId);
      await this.updateRefreshTokenHash(user.id, token.refresh_token);
      const cart = await this.cartRepository.findByUserId(user.id);
      if (!cart) {
        await this.cartRepository.add({
          userId: user.id,
          cartStatus: "active",
        });
      }
      return { ...token, userId: user.id };
    } catch (error) {
      throw error;
    }
  }

  async logout(userId: number): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user?.rt) {
        throw new BadRequestError("User does not have a refresh token");
      }

      await this.userRepository.update(userId, { rt: null });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(userId: number, refreshToken: string): Promise<TokenType> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user?.rt || !compareHash(refreshToken, user.rt)) {
        throw new BadRequestError("Invalid or missing refresh token");
      }

      const token = this.generateToken(user.id, user.roleId);
      await this.updateRefreshTokenHash(user.id, token.refresh_token);
      return token;
    } catch (error) {
      throw error;
    }
  }

  async me(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  private async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hashData = await hash(refreshToken);
    await this.userRepository.update(userId, { rt: hashData });
  }

  private generateToken(userId: number, roleId: number): TokenType {
    const accessToken = signAccessToken(userId, roleId);
    const refreshToken = signRefreshToken(userId, roleId);
    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
