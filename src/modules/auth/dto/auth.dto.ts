import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  name: string;
}

export class LoginDto extends OmitType(SignUpDto, ['name']) {}
