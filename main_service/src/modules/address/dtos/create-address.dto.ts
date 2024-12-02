import { IsInt, IsString, IsOptional, IsNotEmpty, IsEnum,    } from 'class-validator';

export class CreateAddressDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  streetAddress: string | null;

  @IsString()
  @IsNotEmpty()
  wardOrCommune: string | null;

  @IsString()
  @IsNotEmpty()
  district: string | null;

  @IsString()
  @IsNotEmpty()
  cityOrProvince: string | null;
}