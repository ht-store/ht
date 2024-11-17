import request from "@/lib/utils/axios";
import { AxiosResponse } from "axios";

// Define types for brand data
export interface Brand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandResponse {
  success: boolean;
  message: string;
  data: Brand[];
}

// Get all brands
export const getBrands = async (): Promise<AxiosResponse<BrandResponse>> =>
  request.get("/brands");

// Get a single brand by ID
export const getBrandById = async (
  brandId: number
): Promise<
  AxiosResponse<{
    success: boolean;
    message: string;
    data: Brand;
  }>
> => request.get(`/brands/${brandId}`);

// Create a new brand (for admin purposes)
export const createBrand = async (body: {
  name: string;
}): Promise<AxiosResponse> => request.post("/brands", body);

// Update a brand (for admin purposes)
export const updateBrand = async (
  brandId: number,
  body: {
    name: string;
  }
): Promise<AxiosResponse> => request.put(`/brands/${brandId}`, body);

// Delete a brand (for admin purposes)
export const deleteBrand = async (brandId: number): Promise<AxiosResponse> =>
  request.delete(`/brands/${brandId}`);
