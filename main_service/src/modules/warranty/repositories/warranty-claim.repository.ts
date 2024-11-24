import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import {
  warranties,
  Warranty,
  WarrantyClaim,
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
