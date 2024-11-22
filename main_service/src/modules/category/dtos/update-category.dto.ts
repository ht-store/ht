import { IsIn, IsOptional } from "class-validator";

export class UpdateCategoryDto {
  @IsIn(["mobile_phone", "tablet"], {
    message: 'Category name must be either "mobile_phone" or "tablet"',
  })
  @IsOptional() // Marking as optional so it can be left out in the update request
  name?: "mobile_phone" | "tablet";
}
