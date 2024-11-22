import { IsIn } from "class-validator";

export class CreateCategoryDto {
  @IsIn(["mobile_phone", "tablet"], {
    message: 'Category name must be either "mobile_phone" or "tablet"',
  })
  name: "mobile_phone" | "tablet";
}
