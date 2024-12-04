import request from "@/lib/utils/axios";
import { AxiosResponse } from "axios";

export const getProducts = async (query?: {
  brandId?: number | null;
  name?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  page?: number | null;
  pageSize?: number | null;
}): Promise<AxiosResponse> => request.get(`/products`, { params: query });

export const getProductItems = async (
  productId: number | string,
  query?: {
    name?: string | null;
    min_price?: number | null;
    max_price?: number | null;
    page?: number | null;
    pageSize?: number | null;
  }
): Promise<AxiosResponse> =>
  request.get(`/products/relations/${productId}`, { params: query });

export const getProduct = async (
  productId: number,
  skuId: number
): Promise<AxiosResponse> =>
  request.get(`/products/details/${productId}/${skuId}`);

export const getStorage = async (
  productId: number,
  value: string
): Promise<AxiosResponse> => {
  const data = {
    value,
    productId,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIzNTY2MzgwLCJleHAiOjE3MjM2NTI3ODB9.y37g0onCxintcZ8HrLzFwtWuFxU9bVBaCdEEaHwYgTM",
  };

  try {
    const response = await request.post("/products/storages", data, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching storage:", error);
    throw error;
  }
};

export const searchProducts = async (
  productId: number,
  skuId: number
): Promise<AxiosResponse> =>
  request.get(`/products/details/${productId}/${skuId}`);

