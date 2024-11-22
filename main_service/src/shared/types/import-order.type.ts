import { ImportOrder, ImportOrderItem, Sku } from "../database/schemas ";

export type CreateImportOderItemType = {
  importOrderId: string;
  skuId: number;
  quantity: number;
  unitPrice: number;
};

export type CreateImportOrderItemResponseType = ImportOrder & {
  items: ImportOrderItem[];
};

export type CreateImportOrderType = {
  importDate: string;
  importOrderItems: CreateImportOderItemType[];
  supplierId: number;
  status: string;
  total: number;
};

export type CreateImportOrderResponseType = {
  importOrderId: string;
};

export type GetImportOrderType = {
  importOrderId: string;
};

export type DetailOrderItemType = ImportOrderItem & {
  detail: Sku;
};
