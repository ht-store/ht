import express from "express";
import { TYPES } from "src/shared/constants";
import { CartController } from "./cart.controller";
import container from "src/common/ioc-container";
import { auth } from "src/shared/middlewares";

const cartRouter = express.Router();
const controller = container.get<CartController>(TYPES.CartController);

// Lấy tổng quan giỏ hàng
cartRouter.get(
  "/summary/:cartId",
  auth, // Middleware xác thực
  controller.getCartSummary.bind(controller)
);

// Lấy giỏ hàng của người dùng
cartRouter.get(
  "/my-cart",
  auth, // Middleware xác thực
  controller.getCart.bind(controller)
);

// Thêm sản phẩm vào giỏ hàng
cartRouter.post(
  "/item",
  auth, // Middleware xác thực
  controller.addToCart.bind(controller)
);

cartRouter.patch(
  "/item/:cartItemId",
  auth, // Middleware xác thực
  controller.updateItemQuantity.bind(controller)
);

// Cập nhật thông tin giỏ hàng
cartRouter.patch(
  "/:cartId",
  auth, // Middleware xác thực
  controller.updateCart.bind(controller)
);

// Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete(
  "/item/:cartItemId",
  auth, // Middleware xác thực
  controller.removeFromCart.bind(controller)
);

// Xóa toàn bộ giỏ hàng
cartRouter.delete(
  "/:cartId",
  auth, // Middleware xác thực
  controller.clearCart.bind(controller)
);

export default cartRouter;
