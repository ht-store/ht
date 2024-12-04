import { eq, sql } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import {
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


  async findAll() {
    return await this.db.select({
      id: warrantyClaims.id,
      productWarrantyId: warrantyClaims.productWarrantyId,
      claimDate: warrantyClaims.claimDate, 
      issueDescription: warrantyClaims.issueDescription,
      resolution: warrantyClaims.resolution,
      claimStatus: warrantyClaims.claimStatus,
      partsCost: warrantyClaimCosts.partsCost,
      repairCost: warrantyClaimCosts.repairCost, 
      shippingCost: warrantyClaimCosts.shippingCost,
      totalCost: sql<number>`(sum(${warrantyClaimCosts.repairCost} + ${warrantyClaimCosts.partsCost} + ${warrantyClaimCosts.shippingCost}) as float)`
    })
    .from(warrantyClaims)
    .innerJoin(warrantyClaimCosts, eq(warrantyClaims.id, warrantyClaimCosts.claimId));
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
