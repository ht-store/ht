export interface IUser extends IBaseUser {
  id: string;
  name: string;
  role: string;
  phoneNumber: string;
  address: {
    streetAddress: string,
    wardOrCommune: string,
    district: string,
    cityOrProvince: string,
  }
}

export interface IBaseUser {
  email: string;
  password: string;
}
