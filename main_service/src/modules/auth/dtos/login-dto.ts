import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
} from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsString()
  @Length(1, 255)
  email: string;

  @IsString()
  @Length(6, 255)
  password: string;
}
