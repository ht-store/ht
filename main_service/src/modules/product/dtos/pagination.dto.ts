import { IsNumber, Min, Max, IsOptional } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize: number = 20;
}
