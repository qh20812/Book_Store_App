import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('query/created-this-year')
  findBooksCreatedThisYear() {
    return this.booksService.findBooksCreatedThisYear();
  }

  @Get('query/authors-with-5-books')
  findAuthorsWithAtLeast5Books() {
    return this.booksService.findAuthorsWithAtLeast5Books();
  }

  @Get('query/programming-technology')
  findProgrammingBooksInTechnology() {
    return this.booksService.findProgrammingBooksInTechnology();
  }

  @Get('query/specific-fields')
  findBooksWithSpecificFields() {
    return this.booksService.findBooksWithSpecificFields();
  }

  @Post('seed')
  seedBooks() {
    return this.booksService.seedBooks();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
