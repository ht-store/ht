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
