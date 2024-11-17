import { inject, injectable } from "inversify";
import { IProductService } from "src/services";
import { INTERFACE_NAME, STATUS_CODES } from "src/shared/constants";
import { Request, Response, NextFunction } from "express";
import logger from "src/utils/logger";
import { NotFoundError } from "src/shared/errors";
import { CreateProductDto, getProductsDto } from "src/dtos";
import { putObjectUrl } from "src/utils/helper";

@injectable()
export class ProductController {
  constructor(
    @inject(INTERFACE_NAME.ProductService)
    private productService: IProductService
  ) {}

  async getSkus(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, pagination } = getProductsDto.parse({
        filters: {
          ...req.query,
          brandId: parseInt(req.query.brandId as string) || undefined,
          categoryId: parseInt(req.query.categoryId as string) || undefined,
          minPrice: parseInt(req.query.minPrice as string) || undefined,
          maxPrice: parseInt(req.query.maxPrice as string) || undefined,
        },
        pagination: {
          page: parseInt(req.query.page as string) || 1,
          pageSize: parseInt(req.query.pageSize as string) || 20,
        },
      });

      // Call the service layer method
      const products = await this.productService.searchProducts(
        filters.name || "",
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

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, pagination } = getProductsDto.parse({
        filters: {
          ...req.query,
          brandId: parseInt(req.query.brandId as string) || undefined,
          categoryId: parseInt(req.query.categoryId as string) || undefined,
          minPrice: parseInt(req.query.minPrice as string) || undefined,
          maxPrice: parseInt(req.query.maxPrice as string) || undefined,
        },
        pagination: {
          page: parseInt(req.query.page as string) || 1,
          pageSize: parseInt(req.query.pageSize as string) || 20,
        },
      });

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

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const file = req.file;
    const contentType = file.mimetype;

    try {
      const putUrl = await putObjectUrl(file, contentType);
      res.status(201).json(putUrl);
    } catch (error) {
      logger.error("Image upload failed:", error);
      next(error);
    }
  }
}
