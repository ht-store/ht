import { CheckoutType, StripeWebhookEvent } from "src/shared/types";
import {
  CreateOrder,
  CreateOrderItem,
  Order,
} from "src/shared/database/schemas";
import { OrderResponse } from "src/shared/types";

export interface IOrderService {
  /**
   * Places a new order with the given order details and items
   * @param order The order details
   * @param items Array of order items
   * @returns Promise resolving to the created order
   */
  placeOrder(order: CreateOrder, items: CreateOrderItem[]): Promise<Order>;

  /**
   * Retrieves an order by its ID along with its items
   * @param orderId The ID of the order to retrieve
   * @returns Promise resolving to the order with items or null if not found
   */
  getOrder(orderId: number): Promise<OrderResponse | null>;

  /**
   * Lists orders, optionally filtered by user ID
   * @param userId Optional user ID to filter orders
   * @returns Promise resolving to an array of orders
   */
  listOrders(userId?: number): Promise<Order[]>;

  /**
   * Handles Stripe webhook events
   * @param event The Stripe webhook event
   * @returns Promise resolving when the event has been handled
   */
  checkout(
    checkoutDto: CheckoutType,
    customerId: number,
    paymentType: string
  ): Promise<string>;
  webhookHandler(body: any, sig: string): Promise<void>;
}
