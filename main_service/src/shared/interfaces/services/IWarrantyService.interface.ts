import {
  ProductSellWarranty,
  Warranty,
  WarrantyClaim,
  WarrantyClaimCost,
} from "src/shared/database/schemas";

export interface IWarrantyService {
  createWarranty(
    skuId: number,
    warrantyPeriod: number,
    warrantyConditions?: string
  ): Promise<number>;
  getWarrantyBySkuId(skuId: number): Promise<Warranty>;
  updateWarrantyConditions(
    warrantyId: number,
    warrantyConditions: string
  ): Promise<void>;
  activateWarranty(
    serialId: number,
    warrantyId: number,
    warrantyStartDate: Date
  ): Promise<number>;
  getProductWarrantyBySerialId(
    serialId: number
  ): Promise<ProductSellWarranty | null>;
  updateWarrantyStatus(serialId: number, status: string): Promise<void>;
  createClaim(
    serial: string,
    issueDescription: string
  ): Promise<number>;
  getClaimsByWarrantyId(productWarrantyId: number): Promise<WarrantyClaim[]>;
  updateClaimStatus(claimId: number, status: string): Promise<void>;
  addClaimCost(
    claimId: number,
    repairCost: number,
    partsCost: number,
    shippingCost: number,
    currency?: string
  ): Promise<number>;
  getClaimCostsByClaimId(claimId: number): Promise<WarrantyClaimCost[]>;
  getAllClaims(): Promise<WarrantyClaim[]>;
  // Lấy warranty theo trạng thái
  getClaimsByStatus(status: string): Promise<WarrantyClaim[]>;

  // Xóa warranty theo ID
  deleteWarranty(warrantyId: number): Promise<Warranty>;

  // Xóa claim theo ID
  deleteClaim(claimId: number): Promise<WarrantyClaim>;

  // Lấy tất cả sản phẩm có warranty đang được kích hoạt
  getAllActiveWarranties(): Promise<ProductSellWarranty[]>;
}
