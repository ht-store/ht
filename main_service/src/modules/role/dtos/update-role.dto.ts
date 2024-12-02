import { IsOptional, IsString, Length } from "class-validator";

export class UpdateRoleDto {
  @IsString()
  @Length(0, 255)
  @IsOptional()
  name: string;
}
