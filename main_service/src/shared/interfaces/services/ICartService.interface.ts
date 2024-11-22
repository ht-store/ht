import { Cart, CartItem } from "src/shared/database/schemas ";
import { AddItemType, UpdateCartType, UpdateItemType } from "src/shared/types";

export interface ICartService {
  getCarts(): Promise<Cart[]>;
  getOneCart(id: number): Promise<Cart>;
  getUserCart(userId: number): Promise<Cart>;
  createCart(userId: number): Promise<Cart>;
  updateCart(id: number, updateCartData: UpdateCartType): Promise<Cart>;
  deleteCart(id: number): Promise<void>;
  addItemToCart(addItemData: AddItemType): Promise<CartItem>;
  updateItemQuantity(updateItemData: UpdateItemType): Promise<CartItem>;
  removeItemFromCart(cartItemId: number): Promise<void>;
  clearCart(cartId: number): Promise<void>;
  getCartSummary(cartId: number): Promise<{ items: CartItem[]; total: number }>;
}
