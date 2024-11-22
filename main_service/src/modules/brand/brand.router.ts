import express from "express";
import { TYPES } from "src/shared/constants";
import { BrandController } from "./brand.controller";
import container from "src/common/ioc-container";
import { auth } from "src/shared/middlewares";

const brandRouter = express.Router();
const controller = container.get<BrandController>(TYPES.BrandController);

brandRouter.get("/:id", controller.getBrand.bind(controller));
brandRouter.get("/", controller.getBrands.bind(controller));
brandRouter.post("/", auth, controller.createBrand.bind(controller));
brandRouter.patch("/:id", auth, controller.updateBrand.bind(controller));
brandRouter.delete("/:id", auth, controller.deleteBrand.bind(controller));

export default brandRouter;
