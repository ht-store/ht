import { IsNotEmpty, IsNumber } from "class-validator";

export class AddItemDto {
  @IsNumber({}, { message: "cartId must be a number" })
  @IsNotEmpty({ message: "cartId is required" })
  cartId: number;

  @IsNumber({}, { message: "skuId must be a number" })
  @IsNotEmpty({ message: "skuId is required" })
  skuId: number;

  @IsNumber({}, { message: "quantity must be a number" })
  @IsNotEmpty({ message: "quantity is required" })
  quantity: number;
}
