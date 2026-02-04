import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author_first_name: string;

  @IsString()
  author_last_name: string;

  @IsNumber()
  @Min(1000)
  publishing_year: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  num_of_favorites?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  isbn?: string;
}
