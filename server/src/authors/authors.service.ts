import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author, AuthorDocument } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const createdAuthor = new this.authorModel(createAuthorDto);
    return createdAuthor.save();
  }

  async findAll(): Promise<Author[]> {
    return this.authorModel.find().exec();
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.authorModel.findById(id).exec();
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async findByName(first_name: string, last_name: string): Promise<Author | null> {
    return this.authorModel.findOne({ first_name, last_name }).exec();
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const updatedAuthor = await this.authorModel
      .findByIdAndUpdate(id, updateAuthorDto, { new: true })
      .exec();
    if (!updatedAuthor) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return updatedAuthor;
  }

  async remove(id: string): Promise<Author> {
    const deletedAuthor = await this.authorModel.findByIdAndDelete(id).exec();
    if (!deletedAuthor) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return deletedAuthor;
  }

  async getAuthorStats() {
    return this.authorModel.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'author',
          as: 'books',
        },
      },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          full_name: { $concat: ['$first_name', ' ', '$last_name'] },
          email: 1,
          country: 1,
          book_count: { $size: '$books' },
          total_favorites: { $sum: '$books.num_of_favorites' },
        },
      },
      { $sort: { book_count: -1 } },
    ]).exec();
  }

  async seedAuthors() {
    const count = await this.authorModel.countDocuments();
    if (count > 0) {
      return { message: 'Database already contains authors. Skipping seed.' };
    }

    const authors = [
      {
        first_name: 'John',
        last_name: 'Smith',
        bio: 'Expert software engineer with 15+ years of experience',
        email: 'john.smith@example.com',
        country: 'USA',
        birth_date: new Date('1980-05-15'),
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
        bio: 'Python developer and data science enthusiast',
        email: 'jane.doe@example.com',
        country: 'UK',
        birth_date: new Date('1985-08-22'),
      },
      {
        first_name: 'Alice',
        last_name: 'Johnson',
        bio: 'Full-stack web developer and tech educator',
        email: 'alice.johnson@example.com',
        country: 'Canada',
        birth_date: new Date('1990-03-10'),
      },
      {
        first_name: 'Bob',
        last_name: 'Wilson',
        bio: 'Database architect and system designer',
        email: 'bob.wilson@example.com',
        country: 'Australia',
        birth_date: new Date('1978-11-30'),
      },
      {
        first_name: 'Emily',
        last_name: 'Brown',
        bio: 'Award-winning fiction writer',
        email: 'emily.brown@example.com',
        country: 'Ireland',
        birth_date: new Date('1975-07-18'),
      },
      {
        first_name: 'Michael',
        last_name: 'Davis',
        bio: 'History professor and author',
        email: 'michael.davis@example.com',
        country: 'USA',
        birth_date: new Date('1970-02-25'),
      },
    ];

    const savedAuthors = await this.authorModel.insertMany(authors);
    return { 
      message: 'Successfully seeded 6 authors', 
      count: savedAuthors.length,
      authors: savedAuthors 
    };
  }
}
