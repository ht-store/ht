import { Order, OrderItem } from "../database/schemas";

export enum OrderStatus {
  PENDING = "Đang chờ xử lý",
  PROCESSING = "Đang xử lý",
  CONFIRMED = "Được xác nhận",
  SHIPPING = "Đang vận chuyển",
  DELIVERED = "Đã giao hàng",
  CANCELLED = "Đã hủy",
  RETURNED = "Trả lại",
}

export enum PaymentType {
  ONLINE = "online",
  CASH = "Khi nhận hàng",
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

export type OrderResponse = Order & {
  items: OrderItem[];
};

type ProductCartItem = {
  name: string;
  image: string;
  skuId: number;
  quantity: number;
  price: string;
};

export type CheckoutType = {
  cartId?: number;
  items: ProductCartItem[];
};
