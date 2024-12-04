import express, { Router } from "express";
import container from "src/common/ioc-container";
import { ProductController } from "./product.controller";
import { TYPES } from "src/shared/constants";
import { auth } from "src/shared/middlewares";
import multer, { Multer, StorageEngine } from "multer";

const productRouter: Router = express.Router();
const controller: ProductController = container.get<ProductController>(TYPES.ProductController);
const memoryStorage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({
  storage: memoryStorage,
  // Add these options to ensure file parsing
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
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
productRouter.delete("/sku/:skuId", auth, controller.deleteProductSku.bind(controller));
productRouter.delete("/:id", auth, controller.deleteProduct.bind(controller));

export default productRouter;