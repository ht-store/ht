import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { IWarrantyService } from "src/shared/interfaces/services";
import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "src/shared/errors";

@injectable()
export class WarrantyController {
  constructor(
    @inject(TYPES.WarrantyService)
    private warrantyService: IWarrantyService
  ) {}

  // Endpoint to create a warranty
  async createWarranty(req: Request, res: Response): Promise<void> {
    const { skuId, warrantyPeriod, warrantyConditions } = req.body;

    if (!skuId || !warrantyPeriod) {
      throw new BadRequestError("SKU ID and Warranty Period are required.");
    }

    try {
      const warrantyId = await this.warrantyService.createWarranty(
        skuId,
        warrantyPeriod,
        warrantyConditions
      );
      res
        .status(201)
        .json({ message: "Warranty created successfully", warrantyId });
    } catch (error) {
      throw new Error(`Failed to create warranty: ${error}`);
    }
  }

  // Endpoint to get warranty by SKU ID
  async getWarrantyBySkuId(req: Request, res: Response): Promise<void> {
    const { skuId } = req.params;
    if (!skuId) {
      throw new BadRequestError("SKU ID is required.");
    }

    try {
      const warranty = await this.warrantyService.getWarrantyBySkuId(
        Number(skuId)
      );
      res.status(200).json(warranty);
    } catch (error) {
      throw new NotFoundError(`Warranty not found for SKU ID: ${skuId}`);
    }
  }

  // Endpoint to update warranty conditions
  async updateWarrantyConditions(req: Request, res: Response): Promise<void> {
    const { warrantyId, warrantyConditions } = req.body;

    if (!warrantyId || !warrantyConditions) {
      throw new BadRequestError(
        "Warranty ID and warranty conditions are required."
      );
    }

    try {
      await this.warrantyService.updateWarrantyConditions(
        warrantyId,
        warrantyConditions
      );
      res
        .status(200)
        .json({ message: "Warranty conditions updated successfully." });
    } catch (error) {
      throw new Error(`Failed to update warranty conditions: ${error}`);
    }
  }

  // Endpoint to activate warranty
  async activateWarranty(req: Request, res: Response): Promise<void> {
    const { serialId, warrantyId, warrantyStartDate } = req.body;

    if (!serialId || !warrantyId || !warrantyStartDate) {
      throw new BadRequestError(
        "Serial ID, Warranty ID, and Warranty Start Date are required."
      );
    }

    try {
      const warranty = await this.warrantyService.activateWarranty(
        serialId,
        warrantyId,
        new Date(warrantyStartDate)
      );
      res
        .status(201)
        .json({ message: "Warranty activated successfully", warranty });
    } catch (error) {
      throw new Error(`Failed to activate warranty: ${error}`);
    }
  }

  // Endpoint to create a warranty claim
  async createClaim(req: Request, res: Response): Promise<void> {
    const { serial, issueDescription, repairCost, partsCost, shippingCost } = req.body;

    if (!serial || !issueDescription) {
      throw new BadRequestError(
        "Product Warranty ID and Issue Description are required."
      );
    }

    try {
      const claimId = await this.warrantyService.createClaim(
        serial,
        issueDescription,
        repairCost, partsCost, shippingCost,
        "VND"
      );
      res
        .status(201)
        .json({ message: "Warranty claim created successfully", claimId });
    } catch (error) {
      throw new Error(`Failed to create warranty claim: ${error}`);
    }
  }

  // Endpoint to update claim status
  async updateClaimStatus(req: Request, res: Response): Promise<void> {
    const { claimId, status } = req.body;

    if (!claimId || !status) {
      throw new BadRequestError("Claim ID and Status are required.");
    }

    try {
      await this.warrantyService.updateClaimStatus(claimId, status);
      res.status(200).json({ message: "Claim status updated successfully." });
    } catch (error) {
      throw new Error(`Failed to update claim status: ${error}`);
    }
  }

  // Endpoint to add claim costs
  async addClaimCost(req: Request, res: Response): Promise<void> {
    const { claimId, repairCost, partsCost, shippingCost, currency } = req.body;

    if (!claimId || !repairCost || !partsCost || !shippingCost) {
      throw new BadRequestError(
        "Claim ID, Repair Cost, Parts Cost, and Shipping Cost are required."
      );
    }

    try {
      const costId = await this.warrantyService.addClaimCost(
        claimId,
        repairCost,
        partsCost,
        shippingCost,
        currency
      );
      res
        .status(201)
        .json({ message: "Claim costs added successfully", costId });
    } catch (error) {
      throw new Error(`Failed to add claim costs: ${error}`);
    }
  }

  // Endpoint to get claim costs by claim ID
  async getClaimCostsByClaimId(req: Request, res: Response): Promise<void> {
    const { claimId } = req.params;

    if (!claimId) {
      throw new BadRequestError("Claim ID is required.");
    }

    try {
      const costs = await this.warrantyService.getClaimCostsByClaimId(
        Number(claimId)
      );
      res.status(200).json(costs);
    } catch (error) {
      throw new NotFoundError(`Claim costs not found for Claim ID: ${claimId}`);
    }
  }

  // Endpoint to get all warranty claims
  async getAllClaims(req: Request, res: Response): Promise<void> {
    try {
      const claims = await this.warrantyService.getAllClaims();
      res.status(200).json(claims);
    } catch (error) {
      throw new Error(`Failed to get all claims: ${error}`);
    }
  }

  // Endpoint to get claims by status
  async getClaimsByStatus(req: Request, res: Response): Promise<void> {
    const { status } = req.params;

    if (!status) {
      throw new BadRequestError("Status is required.");
    }

    try {
      const claims = await this.warrantyService.getClaimsByStatus(status);
      res.status(200).json(claims);
    } catch (error) {
      throw new Error(`Failed to get claims by status: ${error}`);
    }
  }

  // Endpoint to delete warranty
  async deleteWarranty(req: Request, res: Response): Promise<void> {
    const { warrantyId } = req.params;

    if (!warrantyId) {
      throw new BadRequestError("Warranty ID is required.");
    }

    try {
      await this.warrantyService.deleteWarranty(Number(warrantyId));
      res.status(200).json({ message: "Warranty deleted successfully." });
    } catch (error) {
      throw new Error(`Failed to delete warranty: ${error}`);
    }
  }

  // Endpoint to delete claim
  async deleteClaim(req: Request, res: Response): Promise<void> {
    const { claimId } = req.params;

    if (!claimId) {
      throw new BadRequestError("Claim ID is required.");
    }

    try {
      await this.warrantyService.deleteClaim(Number(claimId));
      res.status(200).json({ message: "Claim deleted successfully." });
    } catch (error) {
      throw new Error(`Failed to delete claim: ${error}`);
    }
  }

  // Endpoint to get all active warranties
  async getAllActiveWarranties(req: Request, res: Response): Promise<void> {
    try {
      const warranties = await this.warrantyService.getAllActiveWarranties();
      res.status(200).json(warranties);
    } catch (error) {
      throw new Error(`Failed to get all active warranties: ${error}`);
    }
  }
}
