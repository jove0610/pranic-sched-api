import { IsEmail, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  isAdmin: string;

  @IsBoolean()
  @IsNotEmpty()
  isOfficeAdmin: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
