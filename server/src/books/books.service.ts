import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './entities/book.entity';
import { Author, AuthorDocument } from '../authors/entities/author.entity';
import { BookCategory } from './entities/book-category.enum';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) { }

  // Get all available book categories
  getCategories() {
    return Object.entries(BookCategory).map(([key, value]) => ({
      value,
      label: value,
      key,
    }));
  }

  // tạo  sách mới
  // mô tả luồng xử lý và chi tiết code: kiểm tra nếu dto có trường author thì tìm tác giả trong cơ sở dữ liệu, nếu không tìm thấy thì ném ra ngoại lệ BadRequestException, nếu tìm thấy thì đồng bộ hóa các trường legacy author_first_name và author_last_name, tạo một đối tượng sách mới từ dto và lưu vào cơ sở dữ liệu, trả về sách đã tạo
  async create(createBookDto: CreateBookDto): Promise<Book> {
    // duyệt và đồng bộ hóa các trường tác giả nếu cung cấp ObjectId tác giả
    if (createBookDto.author) {
      const authorExists = await this.authorModel.findById(createBookDto.author);
      if (!authorExists) {
        throw new BadRequestException(`Author with ID ${createBookDto.author} not found. Please create the author first.`);
      }
      // tự động điền các trường legacy để tương thích ngược
      createBookDto.author_first_name = authorExists.first_name;
      createBookDto.author_last_name = authorExists.last_name;
    }

    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  // tìm toàn bộ sách
  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  // lấy tất cả sách với thông tin tác giả được điền
  // mô tả luồng xử lý và chi tiết code: sử dụng phương thức find của bookmodel để lấy tất cả sách, sử dụng populate để điền thông tin tác giả từ collection authors, trả về danh sách sách với thông tin tác giả
  async findAllWithAuthors() {
    return this.bookModel.find().populate('author').exec();
  }

  // tìm một sách theo ID
  // mô tả luồng xử lý và chi tiết code: tạo biến book, sử dụng phương thức findById của bookmodel để tìm sách theo id, sử dụng populate để điền thông tin tác giả, kiểm tra nếu không tìm thấy sách thì ném ra ngoại lệ NotFoundException, nếu tìm thấy thì trả về sách
  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('author').exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  // cập nhật sách
  // mô tả luồng xử lý và chi tiết code: kiểm tra nếu dto có trường author thì tìm tác giả trong cơ sở dữ liệu, nếu không tìm thấy thì ném ra ngoại lệ BadRequestException, nếu tìm thấy thì đồng bộ hóa các trường legacy author_first_name và author_last_name, sử dụng phương thức findByIdAndUpdate của bookmodel để cập nhật sách theo id với dto, nếu không tìm thấy sách thì ném ra ngoại lệ NotFoundException, nếu tìm thấy thì trả về sách đã cập nhật
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    // duyệt và đồng bộ hóa các trường tác giả nếu cung cấp ObjectId tác giả
    if (updateBookDto.author) {
      const authorExists = await this.authorModel.findById(updateBookDto.author);
      if (!authorExists) {
        throw new BadRequestException(`Author with ID ${updateBookDto.author} not found.`);
      }
      // tự động điền các trường legacy để tương thích ngược
      updateBookDto.author_first_name = authorExists.first_name;
      updateBookDto.author_last_name = authorExists.last_name;
    }

    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }

  // Delete a book
  // mô tả luồng xử lý và chi tiết code: sử dụng phương thức findByIdAndDelete của bookmodel để xóa sách theo id, nếu không tìm thấy sách thì ném ra ngoại lệ NotFoundException, nếu tìm thấy thì trả về sách đã xóa
  async remove(id: string): Promise<Book> {
    const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return deletedBook;
  }

  // Query 1: Lấy tất cả sách được tạo trong năm hiện tại (2026)
  // mô tả luồng xử lý và chi tiết code: lấy năm hiện tại, xác định ngày bắt đầu và kết thúc của năm, sử dụng phương thức find của bookmodel để tìm sách có created_at trong khoảng thời gian này, trả về danh sách sách
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

  // Query 2: Lấy các tác giả có ít nhất 5 cuốn sách
  // mô tả luồng xử lý và chi tiết code: sử dụng phương thức aggregate của bookmodel để nhóm sách theo tên tác giả, đếm số lượng sách của mỗi tác giả, lọc các tác giả có số lượng sách lớn hơn hoặc bằng 5, trả về danh sách tác giả cùng với số lượng sách và danh sách sách của họ
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

  // Query 3: Tìm sách có "programming" trong tiêu đề và thể loại "Technology"
  async findProgrammingBooksInTechnology(): Promise<Book[]> {
    return this.bookModel
      .find({
        title: { $regex: 'programming', $options: 'i' },
        category: 'Technology',
      })
      .exec();
  }

  // Query 4: Lấy thông tin sách với các trường cụ thể
  // mô tả luồng xử lý và chi tiết code: sử dụng phương thức find của bookmodel để lấy tất cả sách, chọn các trường cụ thể, sau đó ánh xạ kết quả để trả về thông tin sách với các trường đã định nghĩa
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
  // mô tả luồng xử lý và chi tiết code: kiểm tra nếu đã có sách trong cơ sở dữ liệu thì bỏ qua việc seed, nếu chưa có thì tìm hoặc tạo các tác giả cần thiết, sau đó tạo các sách với thông tin chi tiết và liên kết đến tác giả tương ứng, cuối cùng lưu các sách vào cơ sở dữ liệu
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
        image_url: 'https://imgs.search.brave.com/8qyFJegYTgqotL2zlMWZAuef3OY_OaUD_HMqyapJpEA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFsYkhMNFBVUkwu/anBn',
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
        image_url: 'https://imgs.search.brave.com/yJHQeV7QuuU0o0zuWP9wJqlNeuph9NqxqK4kh6L_31I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcm9k/dWN0LmhzdGF0aWMu/bmV0LzIwMDAwMDAx/NzM2MC9wcm9kdWN0/L2JpYV9uaGF0X2t5/X3Ryb25nX3R1X2Zp/bGVfaW4tYjFfODVj/YzQ0NzM4MDIxNDc5/MWE4YTdkNzQ2MDNl/ZjQ2YTFfbWFzdGVy/LmpwZw',
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
        image_url: 'https://imgs.search.brave.com/A-FAhYP1C_YkQh8e9XM_t6cTdOtz7mEqr_NI092M7KM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly92aWV0/amFjay5jb20vbmd1/LXZhbi0xMS9pbWFn/ZXMvZGF5LXRob24t/dmktZGEuUE5H',
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
        image_url: 'https://placehold.co/300x420?text=Web+Development',
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
        image_url: 'https://placehold.co/300x420?text=Database+Design',
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
        image_url: 'https://placehold.co/300x420?text=Mobile+Apps',
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
        image_url: 'https://placehold.co/300x420?text=Machine+Learning',
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
        image_url: 'https://placehold.co/300x420?text=Cloud+Computing',
      },
      {
        title: 'The Art of Fiction',
        author: emilyBrown._id,
        author_first_name: 'Emily',
        author_last_name: 'Brown',
        publishing_year: 2023,
        category: 'Fiction',
        num_of_favorites: 85,
        description: 'Explore the world of fiction writing',
        isbn: '978-3213213210',
        image_url: 'https://placehold.co/300x420?text=Fiction',
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
        image_url: 'https://placehold.co/300x420?text=History',
      },
    ];

    await this.bookModel.insertMany(books);
    return { message: 'Successfully seeded 10 books with author references', count: books.length };
  }
}
