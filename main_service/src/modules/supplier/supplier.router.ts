import express from "express";
import { SupplierController } from "./supplier.controller";
import container from "src/common/ioc-container";
import { TYPES } from "src/shared/constants";
import { auth } from "src/shared/middlewares";

const supplierRouter = express.Router();
const controller = container.get<SupplierController>(TYPES.SupplierController);

supplierRouter.get("/:id", controller.getSupplier.bind(controller));
supplierRouter.get("/", controller.getSuppliers.bind(controller));
supplierRouter.post("/", controller.createSupplier.bind(controller));
supplierRouter.patch("/:id", controller.updateSupplier.bind(controller));
supplierRouter.delete("/:id", controller.deleteSupplier.bind(controller));

export default supplierRouter;
