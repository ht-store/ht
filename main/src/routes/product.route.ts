// categoryRouter.ts

import express from "express";
import { ProductController } from "src/controllers";
import { auth } from "src/middlewares/auth";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";
import { upload } from "src/utils/multer";

const productRouter = express.Router();
const controller = container.get<ProductController>(
  INTERFACE_NAME.ProductController
);

// productRouter.get("/all", controller.getProducts.bind(controller));
productRouter.get("/:id", controller.getProduct.bind(controller));
productRouter.get("/", controller.getSkus.bind(controller));
productRouter.get(
  "/relations/:productId",
  controller.getProductsRelation.bind(controller)
);
productRouter.get(
  "/details/:productId/:skuId",
  controller.getProductDetail.bind(controller)
);
productRouter.post("/storages", auth, controller.getStorages.bind(controller));
productRouter.post("/", auth, controller.createProduct.bind(controller));
productRouter.patch("/:id", auth, controller.updateProduct.bind(controller));
productRouter.delete("/:id", auth, controller.deleteProduct.bind(controller));
productRouter.post(
  "/upload-image",
  upload.single("image"),
  controller.uploadImage.bind(controller)
);

export default productRouter;
