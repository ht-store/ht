import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { Cart, CartItem, CreateCart } from "src/shared/database/schemas";
import { BadRequestError, NotFoundError } from "src/shared/errors";
import {
  ICartItemRepository,
  ICartRepository,
} from "src/shared/interfaces/repositories";
import { ICartService } from "src/shared/interfaces/services";
import {
  AddItemType,
  CartItemsType,
  UpdateCartType,
  UpdateItemType,
} from "src/shared/types";

@injectable()
export class CartService implements ICartService {
  constructor(
    @inject(TYPES.CartRepository)
    private readonly cartRepository: ICartRepository,
    @inject(TYPES.CartItemRepository)
    private readonly cartItemRepository: ICartItemRepository
  ) {}

  async getCarts(): Promise<Cart[]> {
    return this.cartRepository.findAll();
  }

  async getOneCart(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundError("Cart not found.");
    }
    return cart;
  }

  async getUserCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findByUserIdRelation(userId);
    if (cart.length <= 0) {
      return await this.cartRepository.findByUserId(userId);
    }
    const res = cart.map((item: any) => ({
      cartId: item.cartId,
      skuId: item.skuId,
      cartItemId: item.cartItemId,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));
    return res;
  }

  async createCart(userId: number): Promise<Cart> {
    const existingCart = await this.cartRepository.findByUserId(userId);
    if (existingCart) {
      throw new BadRequestError(`User ${userId} already has an active cart.`);
    }
    return this.cartRepository.add({
      userId: userId,
      cartStatus: "active",
    });
  }

  async updateCart(id: number, updateCartData: UpdateCartType): Promise<Cart> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundError("Cart not found.");
    }
    return this.cartRepository.update(id, updateCartData);
  }

  async deleteCart(id: number): Promise<void> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundError("Cart not found.");
    }
    await this.cartRepository.delete(id);
  }

  async addItemToCart(addItemData: AddItemType): Promise<CartItem> {
    const { cartId, skuId, quantity } = addItemData;
    const existingItem = await this.cartItemRepository.findByCartIdAndSkuId(
      cartId,
      skuId
    );

    console.log(addItemData)

    if (existingItem) {
      return this.cartItemRepository.update(existingItem.id, {
        quantity: existingItem.quantity + quantity,
      });
    }

    return this.cartItemRepository.add(addItemData);
  }

  async updateItemQuantity(updateItemData: UpdateItemType): Promise<CartItem> {
    const { cartItemId, quantity } = updateItemData;
    const item = await this.cartItemRepository.update(cartItemId, { quantity });
    return item;
  }

  async removeItemFromCart(cartItemId: number): Promise<void> {
    const item = await this.cartItemRepository.findById(cartItemId);
    if (!item) {
      throw new NotFoundError("Cart item not found.");
    }
    await this.cartItemRepository.delete(cartItemId);
  }

  async clearCart(cartId: number): Promise<void> {
    await this.cartItemRepository.deleteByCartId(cartId);
  }

  async getCartSummary(
    cartId: number
  ): Promise<{ items: CartItem[]; total: number }> {
    const items = await this.cartItemRepository.findByCartId(cartId);
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, total };
  }
}
