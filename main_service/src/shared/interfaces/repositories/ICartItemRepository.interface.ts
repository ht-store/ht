import { CartItem } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";

export interface ICartItemRepository extends IRepository<CartItem> {
  findByCartId(cartId: number): Promise<CartItem[]>;
  findByskuId(itemId: number): Promise<CartItem>;
  findByCartIdAndSkuId(itemId: number, cartId: number): Promise<CartItem>;
  deleteByCartId(cartId: number): Promise<void>;
  summary(cartId: number): Promise<{
    items: {
      skuId: number;
      quantity: number;
      price: string;
      total: unknown;
    }[];
    totalPrice: number;
  }>;
}
