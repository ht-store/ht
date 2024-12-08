import { NextFunction, Request, Response } from "express";
import { CheckoutType } from "src/shared/types";
import { IOrderService } from "src/shared/interfaces/services";
import { BadRequestError, NotFoundError } from "src/shared/errors";
import { CreateOrder, CreateOrderItem } from "src/shared/database/schemas";
import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { logger } from "src/shared/middlewares";

@injectable()
export class OrderController {
  constructor(
    @inject(TYPES.OrderService) private readonly orderService: IOrderService
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateOrder = req.body.order;
      const orderItems: CreateOrderItem[] = req.body.items;

      if (!orderData || !orderItems?.length) {
        throw new BadRequestError("Invalid order data or items");
      }

      const order = await this.orderService.placeOrder(orderData, orderItems);
      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Error creating order",
      });
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        throw new BadRequestError("Invalid order ID");
      }

      const order = await this.orderService.getOrder(orderId);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Error retrieving order",
      });
    }
  }

  async listOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.listOrders();
      res.status(200).json({  
        success: true,
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving orders",
      });
    }
  }

  async listHistoryOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      const orders = await this.orderService.listOrderHistory(userId);
      res.status(200).json({  
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error)
    }
  }

  async checkout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const checkoutData: CheckoutType = req.body;
      const userId = req.userId || 1; // Assumes authenticated user
      const paymentType = req.body.paymentType;
      logger.info(paymentType)
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      // Validate checkout data
      // const validationError = validateCheckoutDTO(checkoutData);
      // if (validationError) {
      //   throw new BadRequestError(validationError);
      // }
      const checkoutUrl = await this.orderService.checkout(
        checkoutData,
        userId,
        paymentType
      );
      console.log(checkoutUrl);
      res.status(200).json({
        success: true,
        data: checkoutUrl,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers["stripe-signature"] as string;
      if (!signature) {
        throw new BadRequestError("No stripe signature found");
      }

      await this.orderService.webhookHandler(req.rawBody, signature);
      res.status(200).json({ received: true });
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Error processing webhook",
      });
    }
  }
}
