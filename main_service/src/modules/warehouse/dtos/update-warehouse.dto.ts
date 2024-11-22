import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UpdateWarehouseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber({}, { message: "Capacity must be a number" })
  @Min(1, { message: "Capacity must be at least 1" })
  @IsOptional()
  capacity?: number;
}
