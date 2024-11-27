import { Router } from "express";
import container from "src/common/ioc-container";
import { TYPES } from "src/shared/constants";
import { OrderController } from "./order.controller";
import { auth } from "src/shared/middlewares";

const orderRouter = Router();
const controller = container.get<OrderController>(TYPES.OrderController);

orderRouter.post("/", controller.createOrder.bind(controller));
orderRouter.get("/history", auth,controller.listOrders.bind(controller));
orderRouter.get("/:id", controller.getOrder.bind(controller));
orderRouter.post("/checkout", controller.checkout.bind(controller));
orderRouter.post("/webhook", controller.handleWebhook.bind(controller));

export default orderRouter;
