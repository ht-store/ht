import express from "express";
import container from "src/common/ioc-container";
import { WarehouseController } from "./warehouse.controller";
import { TYPES } from "src/shared/constants";
import { auth } from "src/shared/middlewares";

const warehouseRouter = express.Router();
const controller = container.get<WarehouseController>(
  TYPES.WarehouseController
);

warehouseRouter.get("/:id", controller.getWarehouse.bind(controller));
warehouseRouter.get("/", controller.getWarehouses.bind(controller));
warehouseRouter.post("/", auth, controller.createWarehouse.bind(controller));
warehouseRouter.patch(
  "/:id",
  auth,
  controller.updateWarehouse.bind(controller)
);
warehouseRouter.delete(
  "/:id",
  auth,
  controller.deleteWarehouse.bind(controller)
);

export default warehouseRouter;
