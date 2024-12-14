import { WarrantyClaim } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IWarrantyClaimRepository extends IRepository<WarrantyClaim> {
  findByProductWarrantyId(warrantyId: number): Promise<WarrantyClaim[]>;
  findByStatus(status: string): Promise<WarrantyClaim[]>;
  findAll2(): Promise<{
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
  }[]>
  findById2(id: number):  Promise<{
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
  }> | null
}
