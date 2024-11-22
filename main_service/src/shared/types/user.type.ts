export type UpdateUserType = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  roleId?: number;
};

export type UpdatePasswordType = {
  oldPassword: string;
  newPassword: string;
};
