import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  full_name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
