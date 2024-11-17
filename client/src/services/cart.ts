import request from "@/lib/utils/axios";
import { AxiosResponse } from "axios";

export const getMyCart = async (): Promise<AxiosResponse> =>
  request.get(`/cart/my-cart`);

export const addItemToCart = async (body: {
  price: string;
  cartId: number;
  productItemId: number;
  quantity: number;
}): Promise<AxiosResponse> => request.post(`/cart`, body);

export const removeItemFromCart = async (
  cartItemId: number
): Promise<AxiosResponse> => request.delete(`/cart/${cartItemId}`);
