import {
  IsArray,
  IsDate,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from "class-validator";

export class ImportOrderItemDto {
  @IsNotEmpty()
  @IsString()
  importOrderId: string;

  @IsNumber()
  @IsPositive()
  skuId: number = 0;

  @IsNumber()
  @IsPositive()
  quantity: number = 0;

  @IsNumber()
  @IsPositive()
  unitPrice: number = 0;
}
