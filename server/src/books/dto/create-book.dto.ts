import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { BookCategory } from '../entities/book-category.enum';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  author_first_name?: string;

  @IsOptional()
  @IsString()
  author_last_name?: string;

  @IsNumber()
  @Min(1000)
  publishing_year: number;

  @IsEnum(BookCategory, { message: 'Category must be a valid book category' })
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

  @IsOptional()
  @IsString()
  image_url?: string;
}
