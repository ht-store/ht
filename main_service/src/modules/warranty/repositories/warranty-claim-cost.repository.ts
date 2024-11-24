import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import {
  warranties,
  Warranty,
  WarrantyClaim,
  WarrantyClaimCost,
  warrantyClaimCosts,
  warrantyClaims,
} from "src/shared/database/schemas";
import {
  IWarrantyClaimCostRepository,
  IWarrantyClaimRepository,
  IWarrantyRepository,
} from "src/shared/interfaces/repositories";

@injectable()
export class WarrantyClaimCostRepository
  extends Repository<WarrantyClaimCost>
  implements IWarrantyClaimCostRepository
{
  constructor() {
    super(warrantyClaimCosts);
  }
  async findByClaimId(claimId: number): Promise<WarrantyClaimCost[]> {
    return await this.db
      .select()
      .from(warrantyClaimCosts)
      .where(eq(this.table.claimId, claimId));
  }
}
