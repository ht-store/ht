import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import {
  ProductSellWarranty,
  Warranty,
  WarrantyClaim,
  WarrantyClaimCost,
} from "src/shared/database/schemas";
import { BadRequestError, NotFoundError } from "src/shared/errors";
import {
  IProductSellWarrantyRepository,
  IWarrantyClaimCostRepository,
  IWarrantyClaimRepository,
  IWarrantyRepository,
} from "src/shared/interfaces/repositories";
import { IWarrantyService } from "src/shared/interfaces/services";

@injectable()
export class WarrantyService implements IWarrantyService {
  constructor(
    @inject(TYPES.WarrantyRepository)
    private warrantyRepository: IWarrantyRepository,
    @inject(TYPES.ProductSellWarrantyRepository)
    private productSellWarrantyRepository: IProductSellWarrantyRepository,
    @inject(TYPES.WarrantyClaimRepository)
    private warrantyClaimRepository: IWarrantyClaimRepository,
    @inject(TYPES.WarrantyClaimCostRepository)
    private warrantyClaimCostRepository: IWarrantyClaimCostRepository
  ) {}
  async getAllClaims(): Promise<WarrantyClaim[]> {
    return await this.warrantyClaimRepository.findAll();
  }

  async getClaimsByStatus(status: string): Promise<WarrantyClaim[]> {
    return await this.warrantyClaimRepository.findByStatus(status);
  }

  async deleteWarranty(warrantyId: number): Promise<Warranty> {
    return await this.warrantyRepository.delete(warrantyId);
  }

  async deleteClaim(claimId: number): Promise<WarrantyClaim> {
    return await this.warrantyClaimRepository.delete(claimId);
  }

  async getAllActiveWarranties(): Promise<ProductSellWarranty[]> {
    return await this.productSellWarrantyRepository.findByStatus("active");
  }

  // Warranty Management Methods
  async createWarranty(
    skuId: number,
    warrantyPeriod: number,
    warrantyConditions?: string
  ): Promise<number> {
    const newWarranty = await this.warrantyRepository.add({
      skuId,
      warrantyPeriod,
      warrantyConditions: warrantyConditions || null,
    });
    return newWarranty.id;
  }

  async getWarrantyBySkuId(skuId: number): Promise<Warranty> {
    const warranty = await this.warrantyRepository.findBySkuId(skuId);
    if (!warranty) {
      throw new Error(`Warranty not found for SKU ID: ${skuId}`);
    }
    return warranty;
  }

  async updateWarrantyConditions(
    warrantyId: number,
    warrantyConditions: string
  ): Promise<void> {
    const updated = await this.warrantyRepository.update(warrantyId, {
      warrantyConditions: warrantyConditions || null,
    });
    if (!updated) {
      throw new Error(
        `Failed to update warranty conditions for ID: ${warrantyId}`
      );
    }
  }

  // Product Sell Warranty Methods
  async activateWarranty(
    serialId: number,
    warrantyId: number,
    warrantyStartDate: Date
  ): Promise<number> {
    const warrantyEndDate = new Date(warrantyStartDate);
    const warranty = await this.warrantyRepository.findById(warrantyId);
    if (!warranty) {
      throw new NotFoundError("warranty not found");
    }
    warrantyEndDate.setMonth(
      warrantyEndDate.getMonth() + warranty.warrantyPeriod
    );

    const productSellWarranty = await this.productSellWarrantyRepository.add({
      serialId,
      warrantyId,
      warrantyStartDate: warrantyStartDate.toISOString(),
      warrantyEndDate: warrantyEndDate.toISOString(),
      warrantyStatus: "active",
    });
    return productSellWarranty.id;
  }

  async getProductWarrantyBySerialId(
    serialId: number
  ): Promise<ProductSellWarranty | null> {
    return this.productSellWarrantyRepository.findBySerial(serialId);
  }

  async updateWarrantyStatus(serialId: number, status: string): Promise<void> {
    const updated = await this.productSellWarrantyRepository.update(serialId, {
      warrantyStatus: status,
    });
    if (!updated) {
      throw new Error(
        `Failed to update warranty status for serial ID: ${serialId}`
      );
    }
  }

  // Warranty Claim Methods
  async createClaim(
    productWarrantyId: number,
    issueDescription: string
  ): Promise<number> {
    const claim = await this.warrantyClaimRepository.add({
      productWarrantyId,
      issueDescription,
      claimDate: new Date(),
      claimStatus: "pending",
      resolution: null,
    });
    return claim.id;
  }

  async getClaimsByWarrantyId(
    productWarrantyId: number
  ): Promise<WarrantyClaim[]> {
    return this.warrantyClaimRepository.findByProductWarrantyId(
      productWarrantyId
    );
  }

  async updateClaimStatus(claimId: number, status: string): Promise<void> {
    const updated = await this.warrantyClaimRepository.update(claimId, {
      claimStatus: status,
    });
    if (!updated) {
      throw new Error(`Failed to update claim status for claim ID: ${claimId}`);
    }
  }

  // Warranty Claim Cost Methods
  async addClaimCost(
    claimId: number,
    repairCost: number,
    partsCost: number,
    shippingCost: number,
    currency: string = "VND"
  ): Promise<number> {
    const cost = await this.warrantyClaimCostRepository.add({
      claimId,
      repairCost: repairCost.toFixed(2),
      partsCost: partsCost.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      currency,
    });
    return cost.id;
  }

  async getClaimCostsByClaimId(claimId: number): Promise<WarrantyClaimCost[]> {
    return this.warrantyClaimCostRepository.findByClaimId(claimId);
  }
}
