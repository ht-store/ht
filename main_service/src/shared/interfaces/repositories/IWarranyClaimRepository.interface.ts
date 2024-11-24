import { WarrantyClaim } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IWarrantyClaimRepository extends IRepository<WarrantyClaim> {
  findByProductWarrantyId(warrantyId: number): Promise<WarrantyClaim[]>;
  findByStatus(status: string): Promise<WarrantyClaim[]>;
}
