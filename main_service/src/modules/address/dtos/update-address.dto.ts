import { IsInt, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateAddressDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  streetAddress: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  wardOrCommune: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  district: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cityOrProvince: string | null;
}
