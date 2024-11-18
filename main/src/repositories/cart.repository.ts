import { Cart, cartItems, carts, prices, skus } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import logger from "src/utils/logger";
export interface ICartRepository extends IRepository<Cart> {
  findByUserIdRelation(customerId: number): Promise<any>;
  findByUserId(customerId: number): Promise<any>;
}

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
