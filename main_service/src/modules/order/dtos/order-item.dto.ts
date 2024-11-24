import {
  IsArray,
  IsEmail,
  IsNumber,
  IsPositive,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  skuId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
