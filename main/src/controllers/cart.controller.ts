import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { CreateCartDto, AddItemDto, UpdateCartDto } from "src/dtos";
import { ICartService } from "src/services";
import { INTERFACE_NAME, STATUS_CODES } from "src/shared/constants";
import { BadRequestError } from "src/shared/errors";
import logger from "src/utils/logger";

@injectable()
export class CartController {
  constructor(
    @inject(INTERFACE_NAME.CartService) private cartService: ICartService
  ) {}

  // Lấy giỏ hàng của người dùng
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      console.log(userId);
      const cart = await this.cartService.getUserCart(+userId);

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Cart retrieved successfully.",
        data: cart,
      });
    } catch (error) {
      logger.error("Error in getCart", error);
      next(error); // Truyền lỗi tới middleware xử lý lỗi
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const body = <AddItemDto>req.body;
      const cartItem = await this.cartService.addItemToCart(body);

      return res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: "Item added to cart successfully.",
        data: cartItem,
      });
    } catch (error) {
      logger.error("Error in addToCart", error);
      next(error);
    }
  }

  // Cập nhật thông tin giỏ hàng
  async updateCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cartId = +req.params.cartId;
      const body = <UpdateCartDto>req.body;
      const updatedCart = await this.cartService.updateCart(cartId, body);

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Cart updated successfully.",
        data: updatedCart,
      });
    } catch (error) {
      logger.error("Error in updateCart", error);
      next(error);
    }
  }

  async updateItemQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const cartItemId = +req.params.cartItemId; // Lấy cartItemId từ URL
      const { quantity } = req.body; // Lấy quantity từ payload

      if (!quantity || quantity <= 0) {
        throw new BadRequestError("Quantity must be greater than zero.");
      }

      // Cập nhật số lượng sản phẩm
      const updatedCartItem = await this.cartService.updateItemQuantity({
        cartItemId,
        quantity,
      });

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Item quantity updated successfully.",
        data: updatedCartItem,
      });
    } catch (error) {
      logger.error("Error in updateItemQuantity", error);
      next(error); // Truyền lỗi tới middleware xử lý lỗi
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cartItemId = +req.params.cartItemId;
      await this.cartService.removeItemFromCart(cartItemId);

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Item removed from cart successfully.",
      });
    } catch (error) {
      logger.error("Error in removeFromCart", error);
      next(error);
    }
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cartId = +req.params.cartId;
      await this.cartService.clearCart(cartId);

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Cart cleared successfully.",
      });
    } catch (error) {
      logger.error("Error in clearCart", error);
      next(error);
    }
  }

  // Lấy thông tin tổng quan của giỏ hàng
  async getCartSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const cartId = +req.params.cartId;
      const summary = await this.cartService.getCartSummary(cartId);

      return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Cart summary retrieved successfully.",
        data: summary,
      });
    } catch (error) {
      logger.error("Error in getCartSummary", error);
      next(error);
    }
  }
}
