import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './entities/book.entity';
import { Author, AuthorDocument } from '../authors/entities/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  // Create a new book
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  // Find all books
  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  // Find all books with author details populated
  async findAllWithAuthors() {
    return this.bookModel.find().populate('author').exec();
  }

  // Find one book by ID
  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('author').exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  // Update a book
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }

  // Delete a book
  async remove(id: string): Promise<Book> {
    const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return deletedBook;
  }

  // Query 1: Retrieve all books created in current year (2026)
  async findBooksCreatedThisYear(): Promise<Book[]> {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    return this.bookModel
      .find({
        created_at: {
          $gte: startOfYear,
          $lte: endOfYear,
        },
      })
      .exec();
  }

  // Query 2: Get authors with at least 5 books
  async findAuthorsWithAtLeast5Books() {
    return this.bookModel
      .aggregate([
        {
          $group: {
            _id: {
              first_name: '$author_first_name',
              last_name: '$author_last_name',
            },
            book_count: { $sum: 1 },
            books: { $push: { title: '$title', _id: '$_id' } },
          },
        },
        {
          $match: {
            book_count: { $gte: 5 },
          },
        },
        {
          $project: {
            _id: 0,
            author_first_name: '$_id.first_name',
            author_last_name: '$_id.last_name',
            author_full_name: {
              $concat: ['$_id.first_name', ' ', '$_id.last_name'],
            },
            book_count: 1,
            books: 1,
          },
        },
      ])
      .exec();
  }

  // Query 3: Find books with "programming" in title and category "Technology"
  async findProgrammingBooksInTechnology(): Promise<Book[]> {
    return this.bookModel
      .find({
        title: { $regex: 'programming', $options: 'i' },
        category: 'Technology',
      })
      .exec();
  }

  // Query 4: Get book info with specific fields
  async findBooksWithSpecificFields() {
    return this.bookModel
      .find()
      .select('_id title author_first_name author_last_name publishing_year num_of_favorites')
      .exec()
      .then((books) =>
        books.map((book) => ({
          id: book._id,
          title: book.title,
          author_full_name: `${book.author_first_name} ${book.author_last_name}`,
          publishing_year: book.publishing_year,
          num_of_favorites: book.num_of_favorites,
        })),
      );
  }

  // Seed data: Insert at least 5 documents
  async seedBooks() {
    const count = await this.bookModel.countDocuments();
    if (count > 0) {
      return { message: 'Database already contains books. Skipping seed.' };
    }

    // First, get or create authors
    const johnSmith = await this.authorModel.findOne({ first_name: 'John', last_name: 'Smith' });
    const janeDoe = await this.authorModel.findOne({ first_name: 'Jane', last_name: 'Doe' });
    const aliceJohnson = await this.authorModel.findOne({ first_name: 'Alice', last_name: 'Johnson' });
    const bobWilson = await this.authorModel.findOne({ first_name: 'Bob', last_name: 'Wilson' });
    const emilyBrown = await this.authorModel.findOne({ first_name: 'Emily', last_name: 'Brown' });
    const michaelDavis = await this.authorModel.findOne({ first_name: 'Michael', last_name: 'Davis' });

    if (!johnSmith || !janeDoe || !aliceJohnson || !bobWilson || !emilyBrown || !michaelDavis) {
      return { 
        message: 'Please seed authors first using POST /authors/seed',
        error: 'Authors not found in database'
      };
    }

    const books = [
      {
        title: 'JavaScript Programming: The Complete Guide',
        author: johnSmith._id,
        author_first_name: 'John',
        author_last_name: 'Smith',
        publishing_year: 2024,
        category: 'Technology',
        num_of_favorites: 150,
        description: 'A comprehensive guide to JavaScript programming',
        isbn: '978-1234567890',
      },
      {
        title: 'Python Programming for Beginners',
        author: janeDoe._id,
        author_first_name: 'Jane',
        author_last_name: 'Doe',
        publishing_year: 2025,
        category: 'Technology',
        num_of_favorites: 200,
        description: 'Learn Python from scratch',
        isbn: '978-0987654321',
      },
      {
        title: 'Advanced Programming Techniques',
        author: johnSmith._id,
        author_first_name: 'John',
        author_last_name: 'Smith',
        publishing_year: 2023,
        category: 'Technology',
        num_of_favorites: 95,
        description: 'Master advanced programming concepts',
        isbn: '978-1111222233',
      },
      {
        title: 'Web Development Mastery',
        author: aliceJohnson._id,
        author_first_name: 'Alice',
        author_last_name: 'Johnson',
        publishing_year: 2026,
        category: 'Technology',
        num_of_favorites: 320,
        description: 'Complete web development course',
        isbn: '978-4444555566',
      },
      {
        title: 'Database Design Principles',
        author: bobWilson._id,
        author_first_name: 'Bob',
        author_last_name: 'Wilson',
        publishing_year: 2024,
        category: 'Technology',
        num_of_favorites: 180,
        description: 'Learn database design and optimization',
        isbn: '978-7777888899',
      },
      {
        title: 'Mobile App Development',
        author: johnSmith._id,
        author_first_name: 'John',
        author_last_name: 'Smith',
        publishing_year: 2025,
        category: 'Technology',
        num_of_favorites: 140,
        description: 'Build mobile apps for iOS and Android',
        isbn: '978-1231231234',
      },
      {
        title: 'Machine Learning Fundamentals',
        author: johnSmith._id,
        author_first_name: 'John',
        author_last_name: 'Smith',
        publishing_year: 2026,
        category: 'Technology',
        num_of_favorites: 250,
        description: 'Introduction to machine learning',
        isbn: '978-4564564567',
      },
      {
        title: 'Cloud Computing Essentials',
        author: johnSmith._id,
        author_first_name: 'John',
        author_last_name: 'Smith',
        publishing_year: 2024,
        category: 'Technology',
        num_of_favorites: 175,
        description: 'Master cloud computing concepts',
        isbn: '978-7897897890',
      },
      {
        title: 'The Art of Fiction',
        author: emilyBrown._id,
        author_first_name: 'Emily',
        author_last_name: 'Brown',
        publishing_year: 2023,
        category: 'Literature',
        num_of_favorites: 85,
        description: 'Explore the world of fiction writing',
        isbn: '978-3213213210',
      },
      {
        title: 'Modern History Overview',
        author: michaelDavis._id,
        author_first_name: 'Michael',
        author_last_name: 'Davis',
        publishing_year: 2022,
        category: 'History',
        num_of_favorites: 60,
        description: 'A comprehensive look at modern history',
        isbn: '978-6546546540',
      },
    ];

    await this.bookModel.insertMany(books);
    return { message: 'Successfully seeded 10 books with author references', count: books.length };
  }
}
