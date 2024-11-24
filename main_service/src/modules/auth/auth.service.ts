import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { User } from "src/shared/database/schemas";
import { BadRequestError, NotFoundError } from "src/shared/errors";
import {
  compareHash,
  hash,
  signAccessToken,
  signRefreshToken,
} from "src/shared/helper";
import { ICartRepository } from "src/shared/interfaces/repositories";
import {
  IAuthService,
  ICartService,
  IUserService,
} from "src/shared/interfaces/services";
import {
  EmailOptions,
  LoginResponseType,
  LoginType,
  RegisterResponseType,
  RegisterType,
  TokenType,
} from "src/shared/types";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserService)
    private userService: IUserService,
    @inject(TYPES.CartRepository)
    private cartRepository: ICartRepository
  ) {}

  async register(registerData: RegisterType): Promise<RegisterResponseType> {
    try {
      const user = await this.userService.createUser(registerData);

      const emailOptions: EmailOptions = {
        email: user.email,
        subject: "Kích hoạt tài khoản của bạn",
        template: "activation-mail.ejs",
        data: user,
      };
      return {
        ...user,
        emailOptions,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginType): Promise<LoginResponseType> {
    try {
      const user = await this.userService.getUserByEmail(loginData.email);

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
      const user = await this.userService.getUserById(userId);
      if (!user?.rt) {
        throw new BadRequestError("User does not have a refresh token");
      }
      await this.userService.updateUser(userId, { rt: null });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(userId: number, refreshToken: string): Promise<TokenType> {
    try {
      const user = await this.userService.getUserById(userId);
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
      return await this.userService.getUserById(userId);
    } catch (error) {
      throw error;
    }
  }

  private async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hashData = await hash(refreshToken);
    await this.userService.updateUser(userId, { rt: hashData });
  }

  private generateToken(userId: number, roleId: number): TokenType {
    const accessToken = signAccessToken(userId, roleId);
    const refreshToken = signRefreshToken(userId, roleId);
    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
