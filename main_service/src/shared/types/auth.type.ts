import { User } from "../database/schemas";

export type LoginType = {
  email: string;
  password: string;
};

export type RegisterType = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  roleId: number;
};

export type TokenType = {
  access_token: string;
  refresh_token: string;
};

export type LoginResponseType = TokenType & {
  userId: number;
};

export type EmailOptions = {
  email: string;
  subject: string;
  template: string;
  data: Record<string, any>;
};

export type RegisterResponseType = User & {
  emailOptions: EmailOptions;
};
