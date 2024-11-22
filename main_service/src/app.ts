import { Express } from "express";
import userRouter from "./modules/user/user.router";
import { errorHandler } from "./shared/middlewares";
import authRouter from "./modules/auth/auth.router";
import brandRouter from "./modules/brand/brand.router";
import categoryRouter from "./modules/category/category.router";
import productRouter from "./modules/product/product.router";
import cartRouter from "./modules/cart/cart.router";
import warehouseRouter from "./modules/warehouse/warehouse.router";
import supplierRouter from "./modules/supplier/supplier.router";

export const expressApp = (app: Express) => {
  app.use("/users", userRouter);
  app.use("/auth", authRouter);
  app.use("/brands", brandRouter);
  app.use("/categories", categoryRouter);
  app.use("/products", productRouter);
  app.use("/cart", cartRouter);
  app.use("/warehouses", warehouseRouter);
  app.use("/suppliers", supplierRouter);

  app.use(errorHandler);
};
