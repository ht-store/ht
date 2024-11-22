import { User } from "src/shared/database/schemas ";
import {
  LoginType,
  LoginResponseType,
  RegisterType,
  TokenType,
} from "src/shared/types/auth.type";

export interface IAuthService {
  register(registerData: RegisterType): Promise<User>;
  login(loginData: LoginType): Promise<LoginResponseType>;
  logout(userId: number): Promise<boolean>;
  refreshToken(
    userId: number,
    refreshToken: string,
    roleId: number
  ): Promise<TokenType>;
  me(userId: number): Promise<User>;
}
