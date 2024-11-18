import { Router } from "express";
import { InventoryController } from "src/controllers/inventory.controller";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";

const inventoryRouter = Router();
const controller = container.get<InventoryController>(
  INTERFACE_NAME.InventoryController
);

// Endpoint: Tạo phiếu nhập hàng
inventoryRouter.post("/import-orders", (req, res) =>
  controller.createImportOrder(req, res)
);

// Endpoint: Nhập kho
inventoryRouter.post("/import-stock", (req, res) =>
  controller.importStock(req, res)
);

export default inventoryRouter;
