import express from "express";
import container from "src/common/ioc-container";
import { ProductController } from "./product.controller";
import { TYPES } from "src/shared/constants";
import { auth } from "src/shared/middlewares";
import multer from "multer";

const productRouter = express.Router();
const controller = container.get<ProductController>(TYPES.ProductController);
const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
});

// GET routes
productRouter.get("/", controller.getSkus.bind(controller));
productRouter.get("/:id", controller.getProduct.bind(controller));
productRouter.get(
  "/relations/:productId",
  controller.getProductsRelation.bind(controller)
);
productRouter.get(
  "/details/:productId/:skuId",
  controller.getProductDetail.bind(controller)
);

// POST routes
productRouter.post("/storages", auth, controller.getStorages.bind(controller));
productRouter.post("/", auth, controller.createProduct.bind(controller));
productRouter.post(
  "/upload-image",
  upload.array('images', 10),
  controller.uploadImage.bind(controller)
);

// PATCH routes
productRouter.patch("/:id", auth, controller.updateProduct.bind(controller));

// PUT routes
productRouter.put("/:productId/skus/:skuId", auth, controller.updateProductSku.bind(controller));

// DELETE routes
productRouter.delete("/sku/:id", auth, controller.deleteProduct.bind(controller));
productRouter.delete("/:id", auth, controller.deleteProduct.bind(controller));

export default productRouter;