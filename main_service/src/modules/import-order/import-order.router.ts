import { Router } from "express";
import { TYPES } from "src/shared/constants";
import { ImportOrderController } from "./import-order.controller";
import container from "src/common/ioc-container";

const importOderRouter = Router();
const controller = container.get<ImportOrderController>(
  TYPES.ImportOrderController
);

// Define routes
importOderRouter.post("/", controller.createImportOrder.bind(controller)); // Create import order
importOderRouter.get("/", controller.getImportOrders.bind(controller)); // Get all import orders
importOderRouter.get(
  "/:importId/items",
  controller.getImportOrderItems.bind(controller)
); // Get items of specific order
importOderRouter.get(
  "/items/:itemId/detail",
  controller.getDetailImportOrder.bind(controller)
); // Get detail of specific order item

export default importOderRouter;
