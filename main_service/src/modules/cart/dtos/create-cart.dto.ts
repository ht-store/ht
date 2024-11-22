import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartDto {
  @IsNumber({}, { message: "customerId must be a number" })
  @IsNotEmpty({ message: "customerId is required" })
  customerId: number;

  @IsEnum(["active", "inactive", "expired", "saved"], {
    message:
      "status must be one of 'active', 'inactive', 'expired', or 'saved'",
  })
  @IsNotEmpty({ message: "Cart status is required" })
  status: "active" | "inactive" | "expired" | "saved";
}
