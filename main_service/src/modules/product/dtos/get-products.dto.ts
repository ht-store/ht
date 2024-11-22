import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { GetProductsFilterDto } from "./get-products-filter.dto";
import { PaginationDto } from "./pagination.dto";

export class GetProductsDto {
  @ValidateNested()
  @Type(() => GetProductsFilterDto)
  filters: GetProductsFilterDto;

  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}
