import { Express } from "express";
import { errorHandler } from "./middlewares/error-handler";
import authRouter from "./routes/auth.route";
import brandRouter from "./routes/brand.route";
import categoryRouter from "./routes/category.route";
import roleRouter from "./routes/role.route";
import productRouter from "./routes/product.route";
import supplierRouter from "./routes/supplier.route";
import warehouseRouter from "./routes/warehouse.route";
import cartRouter from "./routes/cart.route";
import userRouter from "./routes/user.route";
import inventoryRouter from "./routes/inventory.route";

export const expressApp = (app: Express) => {
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/brands", brandRouter);
  app.use("/categories", categoryRouter);
  app.use("/products", productRouter);
  app.use("/roles", roleRouter);
  app.use("/suppliers", supplierRouter);
  app.use("/warehouses", warehouseRouter);
  app.use("/cart", cartRouter);
  app.use("/inventories", inventoryRouter);

  app.use(errorHandler);
};
