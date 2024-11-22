import { IsString, Length } from "class-validator";

export class CreateBrandDto {
  @IsString()
  @Length(1, 255)
  name: string;
}
