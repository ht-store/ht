import {
  IsArray,
  IsDate,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
  IsEnum,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { ImportOrderStatus } from "./create-import-order.dto";

export class UpdateImportOrderDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  supplierId?: number;

  @IsOptional()
  @IsString()
  importDate?: string;

  @IsOptional()
  @IsEnum(ImportOrderStatus)
  status?: ImportOrderStatus;
}
