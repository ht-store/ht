import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  @IsString()
  @Length(1, 255)
  email: string;

  @IsString()
  @Length(6, 255)
  password: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsPhoneNumber("VN") // You can specify the country code or just validate globally
  phoneNumber: string;

  @IsNumber()
  roleId: number;
}
