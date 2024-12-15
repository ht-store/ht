import { Router } from "express";
import container from "src/common/ioc-container";
import { TYPES } from "src/shared/constants";
import { WarrantyController } from "./warranty.controller";

const warrantyController = container.get<WarrantyController>(
  TYPES.WarrantyController
);

const warrantyRouter = Router();

// Route to create a warranty
warrantyRouter.post(
  "/warranty",
  warrantyController.createWarranty.bind(warrantyController)
);

// Route to get warranty by SKU ID
warrantyRouter.get(
  "/warranty/:skuId",
  warrantyController.getWarrantyBySkuId.bind(warrantyController)
);

// Route to update warranty conditions
warrantyRouter.put(
  "/warranty/conditions",
  warrantyController.updateWarrantyConditions.bind(warrantyController)
);

// Route to activate warranty
warrantyRouter.post(
  "/warranty/activate",
  warrantyController.activateWarranty.bind(warrantyController)
);

// Route to create a warranty claim
warrantyRouter.post(
  "/claim",
  warrantyController.createClaim.bind(warrantyController)
);

// Route to update claim status
warrantyRouter.put(
  "/claim/status",
  warrantyController.updateClaimStatus.bind(warrantyController)
);

// Route to add claim costs
warrantyRouter.post(
  "/claim/cost",
  warrantyController.addClaimCost.bind(warrantyController)
);

// Route to get claim costs by claim ID
warrantyRouter.get(
  "/claim/cost/:claimId",
  warrantyController.getClaimCostsByClaimId.bind(warrantyController)
);

warrantyRouter.get(
  "/claims/:claimId/",
  warrantyController.getClaimByClaimId.bind(warrantyController)
);

// Route to get all warranty claims
warrantyRouter.get(
  "/claims",
  warrantyController.getAllClaims.bind(warrantyController)
);

// Route to get claims by status
warrantyRouter.get(
  "/claims/status/:status",
  warrantyController.getClaimsByStatus.bind(warrantyController)
);

// Route to delete a warranty
warrantyRouter.delete(
  "/warranty/:warrantyId",
  warrantyController.deleteWarranty.bind(warrantyController)
);

// Route to delete a claim
warrantyRouter.delete(
  "/claim/:claimId",
  warrantyController.deleteClaim.bind(warrantyController)
);

// Route to get all active warranties
warrantyRouter.get(
  "/warranties/active",
  warrantyController.getAllActiveWarranties.bind(warrantyController)
);

export default warrantyRouter;
