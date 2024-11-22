import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "Contact name is required" })
  contactName: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be a valid format",
  })
  @IsNotEmpty({ message: "Phone number is required" })
  phoneNumber: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Address is required" })
  @Length(5, 255, { message: "Address must be between 5 and 255 characters" })
  address: string;
}
