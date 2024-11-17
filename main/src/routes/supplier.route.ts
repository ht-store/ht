import express from "express";
import { SupplierController } from "src/controllers";
import { auth } from "src/middlewares/auth";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";

const supplierRouter = express.Router();
const controller = container.get<SupplierController>(
  INTERFACE_NAME.SupplierController
);

supplierRouter.get("/:id", controller.getSupplier.bind(controller));
supplierRouter.get("/", controller.getSuppliers.bind(controller));
supplierRouter.post("/", auth, controller.createSupplier.bind(controller));
supplierRouter.patch("/:id", auth, controller.updateSupplier.bind(controller));
supplierRouter.delete("/:id", auth, controller.deleteSupplier.bind(controller));

export default supplierRouter;
