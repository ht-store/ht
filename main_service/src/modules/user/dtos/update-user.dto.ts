import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  Length,
} from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  @Length(1, 255)
  @IsOptional()
  email: string;

  @IsString()
  @Length(6, 255)
  @IsOptional()
  password: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  name: string;

  @IsPhoneNumber("VN")
  @IsOptional()
  phoneNumber: string;
}
