import { IsOptional, IsString, Length } from "class-validator";
import { CreateBrandDto } from "./create-brand.dto";

export class UpdateBrandDto {
  @IsString()
  @Length(0, 255)
  @IsOptional()
  name: string;
}
