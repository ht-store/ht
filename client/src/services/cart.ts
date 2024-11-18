import request from "@/lib/utils/axios";
import { AxiosResponse } from "axios";

export const getMyCart = async (): Promise<AxiosResponse> =>
  request.get(`/cart/my-cart`);

export const addItemToCart = async (body: {
  cartId: number;
  skuId: number;
  quantity: number;
}): Promise<AxiosResponse> => request.post(`/cart/item`, body);

export const updateItemQuantity = async (
  cartItemId: number,
  body: {
    quantity: number;
  }
): Promise<AxiosResponse> => request.patch(`/cart/item/${cartItemId}`, body);

export const removeItemFromCart = async (
  cartItemId: number
): Promise<AxiosResponse> => request.delete(`/cart/item/${cartItemId}`);
