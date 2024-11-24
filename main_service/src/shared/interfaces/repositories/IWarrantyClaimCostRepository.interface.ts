import { WarrantyClaimCost } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IWarrantyClaimCostRepository
  extends IRepository<WarrantyClaimCost> {
  findByClaimId(claimId: number): Promise<WarrantyClaimCost[]>;
}
