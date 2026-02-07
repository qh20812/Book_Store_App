import { IsString, IsOptional, IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  first_name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  last_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  birth_date?: Date;
}
