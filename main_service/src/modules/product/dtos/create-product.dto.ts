import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDate,
} from "class-validator";
import { Type } from "class-transformer";
import { Sku } from "src/shared/database/schemas";
import { SkuDto } from "./sku.dto";

class ProductDto {
  @IsString()
  screenSize: string;

  @IsString()
  battery: string;

  @IsString()
  camera: string;

  @IsString()
  processor: string;

  @IsString()
  os: string;

  @IsString()
  name: string;

  @IsNumber()
  brandId: number;

  @IsNumber()
  categoryId: number;

  @IsString()
  image: string;

  @IsString()
  originalPrice: string;

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

class ProductDetailDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkuDto)
  attributes: SkuDto[];

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  image: string;
}

export class CreateProductDto {
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailDto)
  details: ProductDetailDto[];
}
