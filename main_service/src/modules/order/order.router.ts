import { Router } from "express";
import container from "src/common/ioc-container";
import { TYPES } from "src/shared/constants";
import { OrderController } from "./order.controller";

const orderRouter = Router();
const controller = container.get<OrderController>(TYPES.OrderController);

orderRouter.post("/orders", controller.createOrder.bind(controller));
orderRouter.get("/orders/:id", controller.getOrder.bind(controller));
orderRouter.get("/orders", controller.listOrders.bind(controller));
orderRouter.post("/checkout", controller.checkout.bind(controller));
orderRouter.post("/webhook", controller.handleWebhook.bind(controller));

export default orderRouter;
