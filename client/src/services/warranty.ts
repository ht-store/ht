import request from "@/lib/utils/axios";
import { AxiosResponse } from "axios";

// Define types for brand data
export interface Brand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyResponse {
  id: number,
  productWarrantyId: number,
  productName: string,
  seri: string
  claimDate: string,
  issueDescription: string,
  resolution: string | null,
  claimStatus: string,
  partsCost: string,
  repairCost: string,
  shippingCost: string,
  totalCost: string
}

// Get all brands
export const getWarranty = async (warrantyId: number): Promise<AxiosResponse<any>> =>
  request.get(`/warranties/claims/${warrantyId}`);

// Get a single brand by ID
