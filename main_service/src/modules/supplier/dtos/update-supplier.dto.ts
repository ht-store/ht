import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class UpdateSupplierDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  contactName: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be a valid format",
  })
  @IsOptional()
  phoneNumber: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @Length(5, 255, { message: "Address must be between 5 and 255 characters" })
  address: string;
}
