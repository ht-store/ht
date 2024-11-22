import { Cart, CartItem } from "../database/schemas ";

export type CartItemsType = Cart & {
  items: CartItem[];
};
export type CartStatus = "active" | "inactive" | "expired" | "saved";

export interface CreateCartType {
  userId: number;
  status: CartStatus;
}

export interface UpdateCartType extends Partial<CreateCartType> {}

export interface AddItemType {
  cartId: number;
  skuId: number;
  quantity: number;
}

export interface UpdateItemType {
  cartItemId: number;
  quantity: number;
}
