import { injectable } from "inversify";
import { eq, and, sql } from "drizzle-orm";
import {
  CartItem,
  cartItems,
  prices,
  Sku,
  skus,
} from "src/shared/database/schemas";
import { IRepository } from "src/shared/interfaces/repositories/IRepository.interface";
import { BasePropsType } from "src/shared/types";
import { Repository } from "src/shared/base-repository";
import { logger } from "src/shared/middlewares";
import { ICartItemRepository } from "src/shared/interfaces/repositories";

@injectable()
export class CartItemRepository
  extends Repository<CartItem>
  implements ICartItemRepository
{
  constructor() {
    super(cartItems);
  }

  async findByCartId(cartId: number): Promise<CartItem[]> {
    try {
      return await this.db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, cartId))
        .orderBy(cartItems.createdAt);
      // .innerJoin(productItems, eq(cartItems.skuId, productItems.id));

      // const result = [cartItem].map(item => {
      //   return {
      //     cartItem: { ...item.cart_items, productItem: item.product_items }
      //   }
      // })
    } catch (error) {
      logger.error("Error in findCartId", error);
      throw error;
    }
  }

  async findByskuId(itemId: number): Promise<CartItem> {
    try {
      const [item] = await this.db
        .select()
        .from(cartItems)
        .where(eq(cartItems.skuId, itemId))
        .execute();
      return item;
    } catch (error) {
      logger.error("Error in findCartId", error);
      throw error;
    }
  }

  async findByCartIdAndSkuId(cartId: number, skuId: number): Promise<CartItem> {
    try {
      const [item] = await this.db
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.skuId, skuId), eq(cartItems.cartId, cartId)))
        .execute();
      return item;
    } catch (error) {
      logger.error("Error in findCartId", error);
      throw error;
    }
  }

  async deleteByCartId(cartId: number): Promise<void> {
    await this.db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }

  async summary(cartId: number): Promise<{
    items: {
      skuId: number;
      quantity: number;
      price: string;
      total: unknown;
    }[];
    totalPrice: number;
  }> {
    const items = await this.db
      .select({
        skuId: cartItems.skuId,
        quantity: cartItems.quantity,
        price: prices.price,
        total: sql`${cartItems.quantity} * ${prices.price}`,
      })
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId))
      .innerJoin(skus, eq(cartItems.skuId, skus.id))
      .innerJoin(prices, eq(prices.skuId, skus.id))
      .execute();
    const totalPrice = items.reduce((sum, item) => sum + Number(item.total), 0);

    return { items, totalPrice };
  }
}
