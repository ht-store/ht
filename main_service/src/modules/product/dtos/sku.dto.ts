import { IsNumber, IsString } from "class-validator";

export class SkuDto {
  @IsNumber()
  attributeId: number;

  @IsString()
  value: string;
}
