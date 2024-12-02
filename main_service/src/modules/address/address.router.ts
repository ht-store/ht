import express from "express";
import { TYPES } from "src/shared/constants";
import { AddressController } from "./address.controller";
import container from "src/common/ioc-container";
import { auth } from "src/shared/middlewares";

const addressRouter = express.Router();
const controller = container.get<AddressController>(TYPES.AddressController);

addressRouter.get("/:id", controller.getAddress.bind(controller));
addressRouter.get("/", controller.getAddresss.bind(controller));
addressRouter.post("/", auth, controller.createAddress.bind(controller));
addressRouter.patch("/:id", auth, controller.updateAddress.bind(controller));
addressRouter.delete("/:id", auth, controller.deleteAddress.bind(controller));

export default addressRouter;
