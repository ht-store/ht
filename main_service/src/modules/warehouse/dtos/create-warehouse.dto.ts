import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "Location is required" })
  location: string;

  @IsNumber({}, { message: "Capacity must be a number" })
  @Min(1, { message: "Capacity must be at least 1" })
  @IsNotEmpty({ message: "Capacity is required" })
  capacity: number;
}
