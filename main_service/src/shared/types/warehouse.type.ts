export type CreateWarehouseType = {
  name: string;
  location: string;
  capacity: number;
};

export type UpdateWarehouseType = Partial<CreateWarehouseType>;
