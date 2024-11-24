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
import { ImportOrderItemDto } from "./import-order-item.dto";

export enum ImportOrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export class CreateImportOrderDto {
  @IsNumber()
  @IsPositive()
  supplierId: number = 0;

  @IsString()
  importDate: string = "";

  @IsEnum(ImportOrderStatus)
  status: ImportOrderStatus = ImportOrderStatus.PENDING;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportOrderItemDto)
  importOrderItems: ImportOrderItemDto[] = [];

  @IsNumber()
  @IsPositive()
  total: number = 0;
}
