import express from "express";
import { BrandController } from "src/controllers";
import { auth } from "src/middlewares/auth";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";

const brandRouter = express.Router();
const controller = container.get<BrandController>(
  INTERFACE_NAME.BrandController
);

brandRouter.get("/:id", controller.getBrand.bind(controller));
brandRouter.get("/", controller.getBrands.bind(controller));
brandRouter.post("/", auth, controller.createBrand.bind(controller));
brandRouter.patch("/:id", auth, controller.updateBrand.bind(controller));
brandRouter.delete("/:id", auth, controller.deleteBrand.bind(controller));

export default brandRouter;
