import express from "express";
import { ImportOrderController } from "./import-order.controller";
import container from "src/common/ioc-container";
import { TYPES } from "src/shared/constants";
import { auth } from "src/shared/middlewares";

const importOrderRouter = express.Router();
const controller = container.get<ImportOrderController>(
  TYPES.ImportOrderController
);

importOrderRouter.get(
  "/:id/items",
  controller.getImportOrderItems.bind(controller)
);
importOrderRouter.get("/:id", controller.getDetailImportOrder.bind(controller));
importOrderRouter.get("/", controller.getImportOrders.bind(controller));
importOrderRouter.post(
  "/",
  auth,
  controller.createImportOrder.bind(controller)
);

export default importOrderRouter;
