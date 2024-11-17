import express from "express";
import { WarehouseController } from "src/controllers";
import { auth } from "src/middlewares/auth";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";

const warehouseRouter = express.Router();
const controller = container.get<WarehouseController>(
  INTERFACE_NAME.WarehouseController
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
