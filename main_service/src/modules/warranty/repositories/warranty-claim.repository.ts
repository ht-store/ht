import { eq, sql } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import {
  productSellWarranties,
  productSerials,
  skus,
  warranties,
  Warranty,
  WarrantyClaim,
  warrantyClaimCosts,
  warrantyClaims,
} from "src/shared/database/schemas";
import {
  IWarrantyClaimRepository,
  IWarrantyRepository,
} from "src/shared/interfaces/repositories";

@injectable()
export class WarrantyClaimRepository
  extends Repository<WarrantyClaim>
  implements IWarrantyClaimRepository
{
  constructor() {
    super(warrantyClaims);
  }


  async findAll2() {
    return await this.db
        .select({
            id: warrantyClaims.id,
            productWarrantyId: warrantyClaims.productWarrantyId,
            claimDate: warrantyClaims.claimDate, 
            issueDescription: warrantyClaims.issueDescription,
            resolution: warrantyClaims.resolution,
            claimStatus: warrantyClaims.claimStatus,
            partsCost: warrantyClaimCosts.partsCost,
            repairCost: warrantyClaimCosts.repairCost, 
            shippingCost: warrantyClaimCosts.shippingCost,
            totalCost: sql<number>`SUM(${warrantyClaimCosts.repairCost} + ${warrantyClaimCosts.partsCost} + ${warrantyClaimCosts.shippingCost})`.as('totalCost'),
        })
        .from(warrantyClaims)
        .innerJoin(warrantyClaimCosts, eq(warrantyClaims.id, warrantyClaimCosts.claimId))
        .groupBy(
            warrantyClaims.id,
            warrantyClaimCosts.partsCost,
            warrantyClaimCosts.repairCost,
            warrantyClaimCosts.shippingCost
        );
  }

  async findById2(id: number) {
    const [warrantyClaim] = await this.db
        .select({
            id: warrantyClaims.id,
            productWarrantyId: warrantyClaims.productWarrantyId,
            productName: skus.name,
            seri: productSerials.serialNumber,
            claimDate: warrantyClaims.claimDate, 
            issueDescription: warrantyClaims.issueDescription,
            resolution: warrantyClaims.resolution,
            claimStatus: warrantyClaims.claimStatus,
            partsCost: warrantyClaimCosts.partsCost,
            repairCost: warrantyClaimCosts.repairCost, 
            shippingCost: warrantyClaimCosts.shippingCost,
            totalCost: sql<number>`SUM(${warrantyClaimCosts.repairCost} + ${warrantyClaimCosts.partsCost} + ${warrantyClaimCosts.shippingCost})`.as('totalCost'),
        })
        .from(warrantyClaims)
        .innerJoin(warrantyClaimCosts, eq(warrantyClaims.id, warrantyClaimCosts.claimId))
        .innerJoin(productSellWarranties, eq(productSellWarranties.id, warrantyClaims.productWarrantyId))
        .innerJoin(productSerials, eq(productSerials.id, productSellWarranties.serialId))
        .innerJoin(skus, eq(skus.id, productSerials.skuId))
        .where(eq(warrantyClaims.id, id))
        .groupBy(
            warrantyClaims.id,
            warrantyClaimCosts.partsCost,
            warrantyClaimCosts.repairCost,
            warrantyClaimCosts.shippingCost,
            skus.name,
            productSerials.serialNumber
        )
      return warrantyClaim
  }


  async findByStatus(status: string): Promise<WarrantyClaim[]> {
    return await this.db
      .select()
      .from(warrantyClaims)
      .where(eq(warrantyClaims.claimStatus, status));
  }
  async findByProductWarrantyId(warrantyId: number): Promise<WarrantyClaim[]> {
    return await this.db
      .select()
      .from(warrantyClaims)
      .where(eq(warrantyClaims.productWarrantyId, warrantyId));
  }

  
}
