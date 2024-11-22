export type CreateSupplierType = {
  name: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  address: string;
};

export type UpdateSupplierType = Partial<CreateSupplierType>;
