// categoryRouter.ts

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
  upload.array('images', 10),
  controller.uploadImage.bind(controller)
);

export default productRouter;
