import { inject, injectable } from "inversify";
import { Cart, CartItem } from "src/database/schemas";
import { ICartItemRepository, ICartRepository } from "src/repositories";
import { INTERFACE_NAME } from "src/shared/constants";
import { BadRequestError, NotFoundError } from "src/shared/errors";
export type CartStatus = "active" | "inactive" | "expired" | "saved";

export interface CreateCartData {
  userId: number;
  status: CartStatus;
}

export interface UpdateCartData extends Partial<CreateCartData> {}

export interface AddItemData {
  cartId: number;
  skuId: number;
  quantity: number;
}

export interface UpdateItemData {
  cartItemId: number;
  quantity: number;
}

export interface ICartService {
  getCarts(): Promise<Cart[]>;
  getOneCart(id: number): Promise<Cart>;
  getUserCart(userId: number): Promise<Cart>;
  createCart(userId: number): Promise<Cart>;
  updateCart(id: number, updateCartData: UpdateCartData): Promise<Cart>;
  deleteCart(id: number): Promise<void>;
  addItemToCart(addItemData: AddItemData): Promise<CartItem>;
  updateItemQuantity(updateItemData: UpdateItemData): Promise<CartItem>;
  removeItemFromCart(cartItemId: number): Promise<void>;
  clearCart(cartId: number): Promise<void>;
  getCartSummary(cartId: number): Promise<{ items: CartItem[]; total: number }>;
}

@injectable()
export class CartService implements ICartService {
  constructor(
    @inject(INTERFACE_NAME.CartRepository)
    private readonly cartRepository: ICartRepository,
    @inject(INTERFACE_NAME.CartItemRepository)
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
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundError("Cart not found for the user.");
    }
    return cart;
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

  async updateCart(id: number, updateCartData: UpdateCartData): Promise<Cart> {
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

  async addItemToCart(addItemData: AddItemData): Promise<CartItem> {
    const { cartId, skuId, quantity } = addItemData;
    const existingItem = await this.cartItemRepository.findByCartIdAndSkuId(
      cartId,
      skuId
    );

    if (existingItem) {
      return this.cartItemRepository.update(existingItem.id, {
        quantity: existingItem.quantity + quantity,
      });
    }

    return this.cartItemRepository.add(addItemData);
  }

  async updateItemQuantity(updateItemData: UpdateItemData): Promise<CartItem> {
    const { cartItemId, quantity } = updateItemData;
    return this.cartItemRepository.update(cartItemId, { quantity });
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
