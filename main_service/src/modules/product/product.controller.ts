import { inject, injectable } from "inversify";
import { TYPES, STATUS_CODES } from "src/shared/constants";
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "src/shared/errors";
import { IProductService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";
import { CreateProductDto } from "./dtos/create-product.dto";
import { putObjectUrl } from "src/shared/helper";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { GetProductsDto } from "./dtos/get-products.dto";
import { UploadedImageType } from "src/shared/types";

@injectable()
export class ProductController {
  constructor(
    @inject(TYPES.ProductService)
    private productService: IProductService
  ) {}

  async getSkus(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToClass(GetProductsDto, req.query);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new Error("Validation failed");
      }
      console.log(req.query)
      const name = req.query.name as string;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 18;
      const brandId = req.query.name as string;
      
      // Call the service layer method
      const products = await this.productService.searchProducts(
        name || null,
        page || 1,
        pageSize,
        parseInt(req.query.brandId as string) || null,
      );
      const response = {
        success: true,
        message: "Get products is successful",
        data: products,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Get products failed", error);
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToClass(GetProductsDto, req.query);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new Error("Validation failed");
      }
      const { filters, pagination } = {
        filters: {
          ...dto.filters,
          brandId: parseInt(req.query.brandId as string) || undefined,
          categoryId: parseInt(req.query.categoryId as string) || undefined,
          minPrice: parseInt(req.query.minPrice as string) || undefined,
          maxPrice: parseInt(req.query.maxPrice as string) || undefined,
        },
        pagination: {
          page: parseInt(req.query.page as string) || 1,
          pageSize: parseInt(req.query.pageSize as string) || 20,
        },
      };

      // Call the service layer method
      const products = await this.productService.getProducts(
        filters,
        pagination.page,
        pagination.pageSize
      );
      const response = {
        success: true,
        message: "Get products is successful",
        data: products,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error("Get products failed", error);
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const product = await this.productService.getProduct(id);
      const response = {
        success: true,
        message: "Get product is successful",
        data: product,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error(`Get Product with id ${id} failed`, error);
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const createProductDto = <CreateProductDto>req.body;
      const newProduct =
        await this.productService.createProduct(createProductDto);
      const response = {
        success: true,
        message: "Create product is successful",
        data: newProduct,
      };
      return res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
      logger.error("Create Product failed", error);
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const updateProductDto = req.body;
    try {
      const updatedProduct = await this.productService.updateProduct(
        id,
        updateProductDto
      );
      const response = {
        success: true,
        message: "Update product is successful",
        data: updatedProduct,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Update Product with id ${id} failed`, error);
      next(error);
    }
  }

  async updateProductSku(req: Request, res: Response, next: NextFunction) {
    const productId = parseInt(req.params.productId);
    const skuId = parseInt(req.params.skuId);
    const updateProductDto = req.body;
    try {
      const updatedProduct = await this.productService.updateProductSku(
        productId,
        skuId,
        updateProductDto
      );
      const response = {
        success: true,
        message: "Update product is successful",
        data: updatedProduct,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Update Product with id ${skuId} failed`, error);
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedProduct = await this.productService.deleteProduct(id);
      const response = {
        success: true,
        message: "Delete product is successful",
        data: deletedProduct,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Delete Product with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteProductSku(req: Request, res: Response, next: NextFunction) {
    const skuId = parseInt(req.params.skuId);
    try {
      const deletedProduct = await this.productService.deleteProductSku(skuId);
      const response = {
        success: true,
        message: "Delete product skuId is successful",
        data: deletedProduct,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: error.message });
      }
      logger.error(`Delete Product with id ${skuId} failed`, error);
      next(error);
    }
  }

  async getProductsRelation(req: Request, res: Response, next: NextFunction) {
    const productId = parseInt(req.params.productId);
    try {
      const products = await this.productService.getSkusByProductId(productId);
      const response = {
        success: true,
        message: "Get products relation is successful",
        data: products,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error(`Get Products by brandId ${productId} failed`, error);
      next(error);
    }
  }

  async getProductDetail(req: Request, res: Response, next: NextFunction) {
    const skuId = parseInt(req.params.skuId);
    const productId = parseInt(req.params.productId);
    try {
      const products = await this.productService.getDetail(productId, skuId);
      const response = {
        success: true,
        message: "Get products relation is successful",
        data: products,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error(`Get Products by brandId ${skuId} failed`, error);
      next(error);
    }
  }

  async getStorages(req: Request, res: Response, next: NextFunction) {
    const { value, productId } = req.body;
    try {
      const products = await this.productService.getStorages(value, +productId);
      const response = {
        success: true,
        message: "Get products relation is successful",
        data: products,
      };
      return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      logger.error(`Get Products by brandId ${value} failed`, error);
      next(error);
    }
  }



  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.files)
      const images = req.files as Express.Multer.File[] | undefined;
      if (!images || images.length === 0) {
        res.status(400).json({ message: "No images uploaded" });
        return;
      }
      const uploadedResults: UploadedImageType[] = [];
      const uploadPrefix = `skus/`;
      for (const image of images) {
        const { name, path } = await this.productService.handleUploadImage(image, uploadPrefix);
        uploadedResults.push({ name, path });
      }
  
      if (uploadedResults.length === 1) {
        res.status(200).json({
          success: "OK",
          data: { image_url: uploadedResults[0].path },
        });
      } else {
        const folderUrl = `${process.env.CLOUDFLARE_IMG_PATH}${uploadPrefix}`;
        res.status(200).json({
          success: "OK",
          data: {
            folder_url: folderUrl,
            valid_images: uploadedResults,
          },
        });
      }
    } catch (error) {
      logger.error("Image upload failed:", error);
      next(error);
    }
  }

  
}
