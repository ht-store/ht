import { IsOptional } from "class-validator";

export class UpdateCartDto {
  @IsOptional({ message: "Cart status is required" })
  status: "active" | "inactive" | "expired" | "saved";
}
