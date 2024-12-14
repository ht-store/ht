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
  IProductSerialRepository,
  IWarrantyClaimCostRepository,
  IWarrantyClaimRepository,
  IWarrantyRepository,
} from "src/shared/interfaces/repositories";
import { IWarrantyService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";

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
    private warrantyClaimCostRepository: IWarrantyClaimCostRepository,
    @inject(TYPES.ProductSerialRepository)
    private productSerialRepository: IProductSerialRepository
  ) {}
  async getWarrantyClaim(id: number): Promise<{ id: number; productWarrantyId: number | null; claimDate: Date | null; issueDescription: string; resolution: string | null; claimStatus: string | null; partsCost: string | null; repairCost: string | null; shippingCost: string | null; totalCost: number; }> {
    try {
      const claim = await this.warrantyClaimRepository.findById2(id);
      if (!claim) {
        throw new NotFoundError("Claim not found");
      }
      return claim
    } catch(err) {
      throw err
    }
  }
  async getAllClaims(): Promise<{
    id: number;
    productWarrantyId: number | null;
    claimDate: Date | null;
    issueDescription: string;
    resolution: string | null;
    claimStatus: string | null;
    partsCost: string | null;
    repairCost: string | null;
    shippingCost: string | null;
    totalCost: number;
}[]> {
    try {
      return await this.warrantyClaimRepository.findAll2();
    } catch(err) {
      throw err
    }
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

  async getWarrantyBySkuId(skuId: number): Promise<Warranty | null> {
    const warranty = await this.warrantyRepository.findBySkuId(skuId);
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
    serial: string,
    issueDescription: string,
    repairCost: number,
    partsCost: number,
    shippingCost: number
  ): Promise<number> {
    const productSeri = await this.productSerialRepository.findBySerial(serial)
    if (!productSeri) {
      throw new NotFoundError("Seri not found")
    }
    const productWarranty = await this.productSellWarrantyRepository.findBySerial(
      productSeri.id
    );
    if (!productWarranty) {
      throw new NotFoundError("product not found");
    }
    if (productWarranty.warrantyStatus !== "active") {
      throw new BadRequestError("product warranty is not active");
    }
    const claim = await this.warrantyClaimRepository.add({
      productWarrantyId: productWarranty.id,
      issueDescription,
      claimDate: new Date(),
      claimStatus: "pending",
      resolution: null,
    });
    console.log(repairCost);
    console.log(partsCost); 

    
    await this.addClaimCost(claim.id, repairCost, partsCost, shippingCost);
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
    console.log(repairCost)
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
