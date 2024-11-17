import { Cart, cartItems, carts, skus } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import logger from "src/utils/logger";
export interface ICartRepository extends IRepository<Cart> {
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

  async findByUserId(userId: number): Promise<any> {
    try {
      const [cart] = await this.db
        .select()
        .from(carts)
        .leftJoin(cartItems, eq(cartItems.cartId, carts.id))
        .leftJoin(skus, eq(skus.id, cartItems.skuId))
        .where(eq(carts.userId, userId))
        .execute();
      return cart;
    } catch (error) {
      logger.error("Error in findByuserId", error);
      throw error;
    }
  }
}
