import Stripe from "stripe";
import {
  StripeWebhookEvent,
  OrderStatus,
  OrderResponse,
  CheckoutType,
  PaymentType,
} from "src/shared/types";
import {
  IOrderItemRepository,
  IOrderRepository,
  IProductSerialRepository,
  IUserRepository,
} from "src/shared/interfaces/repositories";
import {
  CreateOrder,
  CreateOrderItem,
  Order,
  OrderItem,
} from "src/shared/database/schemas";
import { IOrderService } from "src/shared/interfaces/services";
import { BadRequestError, NotFoundError } from "src/shared/errors";
import config from "src/config";
import { logger } from "src/shared/middlewares";
import { DB } from "src/shared/database/connect";
import { inject } from "inversify";
import { TYPES } from "src/shared/constants";

export class OrderService implements IOrderService {
  private readonly stripe: Stripe;
  constructor(
    @inject(TYPES.OrderRepository) private orderRepo: IOrderRepository,
    @inject(TYPES.OrderItemRepository)
    private orderItemRepo: IOrderItemRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ProductSerialRepository)
    private productSerialRepository: IProductSerialRepository
  ) {
    this.stripe = new Stripe(
      "sk_test_51NrvBlBRW0tzi9hCKyOzdVSm5bMrlprFwyrXbzDI2OhI2gZFfJPpw0kr8981x0p3EhYo7ysXMGriS8TAoKTrqnDk00kqf5mes6",
      {
        apiVersion: "2024-06-20",
      }
    );
  }

  async placeOrder(
    order: CreateOrder,
    items: CreateOrderItem[]
  ): Promise<Order> {
    const createdOrder = await this.orderRepo.createOrder(order);
    for (const item of items) {
      await this.orderItemRepo.add({
        ...item,
        orderId: createdOrder.id,
      });
    }
    return createdOrder;
  }

  async getOrder(orderId: number): Promise<OrderResponse | null> {
    const order = await this.orderRepo.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    const items = await this.orderItemRepo.getOrderItemsByOrderId(orderId);
    return {
      ...order,
      items,
    };
  }

  async listOrders(userId?: number): Promise<Order[]> {
    if (userId) {
      return this.orderRepo.getOrdersByUserId(userId);
    }
    return this.orderRepo.getAllOrders();
  }

  async handleStripeWebhook(event: StripeWebhookEvent): Promise<void> {
    const { type, data } = event;
    if (type === "checkout.session.completed") {
      const session = data.object;
      const orderId = session.metadata.orderId; // Assumes orderId is stored in metadata
      await this.orderRepo.updateOrderStatus(orderId, OrderStatus.CONFIRMED);
    }
    // Handle other Stripe events if needed
  }

  async checkout(
    checkoutDto: CheckoutType,
    userId: number,
    paymentType: string
  ): Promise<string> {
    try {
      let lineItems = [];
      for (let i = 0; i < checkoutDto.items.length; i++) {
        lineItems.push({
          price_data: {
            currency: "vnd",
            product_data: {
              name: checkoutDto.items[i].name,
              metadata: {
                skuId: checkoutDto.items[i].skuId,
                cartId: checkoutDto.cartId || null,
              },
            },
            unit_amount: Math.round(Number(checkoutDto.items[i].price)),
          },
          quantity: checkoutDto.items[i].quantity,
        });
      }
      if (lineItems.length < 1) {
        throw new BadRequestError("These products are not available right now");
      }
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      if (paymentType === "cash") {
        // Handle cash payment
        const orderData: CreateOrder = {
          userId: user.id,
          totalPrice: lineItems
            .reduce(
              (acc, item) => acc + item.price_data.unit_amount * item.quantity,
              0
            )
            .toString(),
          orderDate: new Date(),
          orderStatus: OrderStatus.PENDING, // Or another status suitable for cash orders
          checkoutSessionId: "",
          stripePaymentIntentId: "",
          paymentType: PaymentType.CASH,
        };

        const order = await this.orderRepo.add({
          ...orderData,
          userId: user.id,
          orderDate: new Date(),
          shippingAddressId: 1,
        });

        // Update inventory, etc., as needed
        for (const item of lineItems) {
          const serial = await this.productSerialRepository.findFirstBySkuId(
            item.price_data.product_data.metadata.skuId
          );

          if (!serial) {
            throw new BadRequestError(`Serial number is not available`);
          }
          const orderItemData: CreateOrderItem = {
            orderId: order.id,
            skuId: +item.price_data.product_data.metadata.skuId,
            quantity: item.quantity,
            price: item.price_data.unit_amount.toString(),
            serialId: serial.id,
          };
          await this.orderItemRepo.add(orderItemData);
          await this.orderItemRepo.add({
            orderId: order.id,
            price: item.price_data.unit_amount.toString(),
            quantity: item.quantity,
            skuId: +item.price_data.product_data.metadata.skuId,
            serialId: serial.id,
          });
          await this.productSerialRepository.update(serial.id, {
            status: "sold",
          });
        }
        // if (checkoutDto.cartId) {
        //   await DB.delete(cartItems).where(eq(cartItems.cartId, checkoutDto.cartId)).execute();
        // }

        return "Cash payment order created successfully";
      }
      let stripeId = user.stripeId;
      if (!stripeId) {
        const customerStripe = await this.stripe.customers.create({
          email: user.email,
          name: user.name,
        });
        await this.userRepository.update(userId, {
          stripeId: customerStripe.id,
        });
        stripeId = customerStripe.id;
      }

      const session = await this.stripe.checkout.sessions.create({
        customer: stripeId,
        line_items: lineItems,
        metadata: {
          customer_id: user.id,
          customer_stripe_id: stripeId,
          cart_id: checkoutDto.cartId || null,
          product_items: JSON.stringify(
            checkoutDto.items.map((item) => ({
              quantity: item.quantity,
              skuId: item.skuId,
            }))
          ),
        },
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
          enabled: true,
        },
        success_url: config.SUCCESS_URL,
        cancel_url: config.CANCEL_URL,
      });
      return session.url || "";
    } catch (error) {
      throw error;
    }
  }

  async webhookHandler(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.WEBHOOK_SECRET
      );

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.handleCompletedCheckoutSession(session);
          break;
        }
        case "checkout.session.expired": {
          const session = event.data.object as Stripe.Checkout.Session;
          // await this.handleExpiredCheckoutSession(session);
          break;
        }
        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          // await this.handleFailedPayment(paymentIntent);
          break;
        }
        // Add other webhook events as needed
        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      logger.error("Webhook handler error:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (
        error instanceof Error &&
        error.message.includes("webhook signature")
      ) {
        throw new BadRequestError("Invalid webhook signature");
      }

      throw error; // Re-throw for other errors to trigger retry
    }
  }
  private async handleCompletedCheckoutSession(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    try {
      // Extract and validate metadata
      if (!session.metadata?.product_items || !session.metadata?.customer_id) {
        throw new BadRequestError("Invalid session metadata");
      }

      const productItems = JSON.parse(session.metadata.product_items) as Array<{
        skuId: number;
        quantity: number;
      }>;

      // Fetch line items
      const lineItems = await this.stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price"],
        }
      );
      logger.info(session.amount_total);
      // Create order
      const orderData = {
        userId: parseInt(session.metadata.customer_id),
        totalPrice: session.amount_total?.toString() || "0",
        orderDate: new Date(),
        orderStatus: OrderStatus.PENDING,
        checkoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        paymentType: PaymentType.ONLINE,
        shippingAddressId: 1,
      };

      // Start transaction
      const order = await DB.transaction(async (trx) => {
        // Create order
        const newOrder = await this.orderRepo.add(orderData);

        // Process each line item
        await Promise.all(
          lineItems.data.map(async (item, index) => {
            if (!item.price?.unit_amount || !item.quantity) {
              throw new Error(`Invalid line item data for item ${index}`);
            }

            const productItem = productItems[index];

            // Get available product serials

            // Create order detail
            const serial = await this.productSerialRepository.findFirstBySkuId(
              productItem.skuId
            );
            if (!serial) {
              throw new Error(
                `No available serials for SKU ID ${productItem.skuId}`
              );
            }
            const orderDetailData = {
              orderId: newOrder.id,
              skuId: productItem.skuId,
              quantity: item.quantity,
              price: item.price.unit_amount.toString(),
              serialId: serial.id,
            };

            await this.orderItemRepo.add(orderDetailData);

            // Update inventory quantity
            await this.productSerialRepository.update(serial.id, {
              status: "sold",
            });
          })
        );

        // Clear cart items if cart ID exists

        // Update order status
        await this.orderRepo.update(newOrder.id, {
          orderStatus: OrderStatus.PROCESSING,
        });

        return newOrder;
      });

      // Send order confirmation
      // await this.sendOrderConfirmation(order);
    } catch (error) {
      logger.error("Error handling completed checkout session:", {
        error: error instanceof Error ? error.message : "Unknown error",
        sessionId: session.id,
        customerId: session.metadata?.customer_id,
      });

      // Initiate refund if needed
      if (session.payment_intent) {
        // await this.initiateRefund(session.payment_intent as string);
      }

      throw error;
    }
  }
}
