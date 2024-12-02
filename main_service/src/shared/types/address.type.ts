export type UpdateAddressType = {
  userId: number;
  streetAddress: string | null;
  wardOrCommune: string | null;
  district: string | null;
  cityOrProvince: string | null;
};

export type CreateAddressType = {
  userId: number;
  streetAddress: string | null;
  wardOrCommune: string | null;
  district: string | null;
  cityOrProvince: string | null;
};
