import { eq } from "drizzle-orm";
import { inject, injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { TYPES } from "src/shared/constants";
import {
  Cart,
  cartItems,
  carts,
  prices,
  skus,
} from "src/shared/database/schemas ";
import { ICartRepository } from "src/shared/interfaces/repositories";
import { logger } from "src/shared/middlewares";

@injectable()
export class CartRepository
  extends Repository<Cart>
  implements ICartRepository
{
  constructor() {
    super(carts);
  }
  async findByUserIdRelation(userId: number): Promise<any> {
    try {
      const cart = await this.db
        .select({
          cartId: carts.id,
          skuId: skus.id,
          cartItemId: cartItems.id,
          productName: skus.name,
          productImage: skus.image,
          quantity: cartItems.quantity,
          price: prices.price,
        })
        .from(carts)
        .innerJoin(cartItems, eq(cartItems.cartId, carts.id))
        .innerJoin(skus, eq(skus.id, cartItems.skuId))
        .innerJoin(prices, eq(skus.id, prices.skuId))
        .where(eq(carts.userId, userId))
        .execute();

      return cart;
    } catch (error) {
      logger.error("Error in findByuserId", error);
      throw error;
    }
  }

  async findByUserId(userId: number): Promise<any> {
    try {
      const cart = await this.db
        .select({
          cartId: carts.id,
        })
        .from(carts)
        .where(eq(carts.userId, userId))
        .execute();

      return cart;
    } catch (error) {
      logger.error("Error in findByuserId", error);
      throw error;
    }
  }
}
