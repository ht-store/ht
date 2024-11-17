import request from '@/lib/utils/axios';
import { AxiosResponse } from 'axios';

type ProductCartItem = {
  name: string;
  image: string;
  SKU: string;
  quantity: number;
  productItemId: number;
  price: string;
};

type CheckoutBody = {
  cartId?: number;
  productItems: ProductCartItem[];
};

export const orderCheckout = async (body: CheckoutBody): Promise<AxiosResponse> =>
  request.post(`/orders/checkout`, body);

export const orderHistory = async (): Promise<AxiosResponse> => request.get(`/orders`);