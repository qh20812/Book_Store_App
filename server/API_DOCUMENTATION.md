# Book Store API Documentation

## MongoDB Schema Design

### Book Collection Structure
```javascript
{
  _id: ObjectId,
  title: String (indexed),
  author_first_name: String,
  author_last_name: String,
  publishing_year: Number,
  category: String,
  num_of_favorites: Number,
  description: String,
  isbn: String,
  created_at: Date,
  updated_at: Date
}
```

## API Endpoints

### 1. CRUD Operations

#### Create a Book
**POST** `/books`
```json
{
  "title": "JavaScript Programming",
  "author_first_name": "John",
  "author_last_name": "Smith",
  "publishing_year": 2024,
  "category": "Technology",
  "num_of_favorites": 150,
  "description": "A comprehensive guide",
  "isbn": "978-1234567890"
}
```

#### Get All Books
**GET** `/books`

#### Get Book by ID
**GET** `/books/:id`

#### Update Book
**PATCH** `/books/:id`

#### Delete Book
**DELETE** `/books/:id`

---

### 2. Special Queries

#### Seed Database (Insert 10 Books)
**POST** `/books/seed`

Chèn 10 tài liệu mẫu vào cơ sở dữ liệu, bao gồm John Smith với 5 cuốn sách.

---

#### Query 1: Books Created This Year (2026)
**GET** `/books/query/created-this-year`

Truy vấn MongoDB:
```javascript
{
  created_at: {
    $gte: new Date('2026-01-01'),
    $lte: new Date('2026-12-31')
  }
}
```

**Response Example:**
```json
[
  {
    "_id": "...",
    "title": "Web Development Mastery",
    "author_first_name": "Alice",
    "author_last_name": "Johnson",
    "publishing_year": 2026,
    "category": "Technology",
    "created_at": "2026-02-05T..."
  }
]
```

---

#### Query 2: Authors with At Least 5 Books
**GET** `/books/query/authors-with-5-books`

Sử dụng MongoDB Aggregation Pipeline:
```javascript
[
  {
    $group: {
      _id: {
        first_name: '$author_first_name',
        last_name: '$author_last_name'
      },
      book_count: { $sum: 1 },
      books: { $push: { title: '$title', _id: '$_id' } }
    }
  },
  {
    $match: { book_count: { $gte: 5 } }
  },
  {
    $project: {
      author_first_name: '$_id.first_name',
      author_last_name: '$_id.last_name',
      author_full_name: {
        $concat: ['$_id.first_name', ' ', '$_id.last_name']
      },
      book_count: 1,
      books: 1
    }
  }
]
```

**Response Example:**
```json
[
  {
    "author_first_name": "John",
    "author_last_name": "Smith",
    "author_full_name": "John Smith",
    "book_count": 5,
    "books": [
      { "_id": "...", "title": "JavaScript Programming: The Complete Guide" },
      { "_id": "...", "title": "Advanced Programming Techniques" },
      { "_id": "...", "title": "Mobile App Development" },
      { "_id": "...", "title": "Machine Learning Fundamentals" },
      { "_id": "...", "title": "Cloud Computing Essentials" }
    ]
  }
]
```

---

#### Query 3: Programming Books in Technology Category
**GET** `/books/query/programming-technology`

Truy vấn MongoDB với regex:
```javascript
{
  title: { $regex: 'programming', $options: 'i' },
  category: 'Technology'
}
```

**Response Example:**
```json
[
  {
    "_id": "...",
    "title": "JavaScript Programming: The Complete Guide",
    "author_first_name": "John",
    "author_last_name": "Smith",
    "publishing_year": 2024,
    "category": "Technology"
  },
  {
    "_id": "...",
    "title": "Python Programming for Beginners",
    "author_first_name": "Jane",
    "author_last_name": "Doe",
    "publishing_year": 2025,
    "category": "Technology"
  }
]
```

---

#### Query 4: Books with Specific Fields
**GET** `/books/query/specific-fields`

Projection với các trường: id, title, author_full_name, publishing_year, num_of_favorites

**Response Example:**
```json
[
  {
    "id": "...",
    "title": "JavaScript Programming: The Complete Guide",
    "author_full_name": "John Smith",
    "publishing_year": 2024,
    "num_of_favorites": 150
  },
  {
    "id": "...",
    "title": "Python Programming for Beginners",
    "author_full_name": "Jane Doe",
    "publishing_year": 2025,
    "num_of_favorites": 200
  }
]
```

---

## MongoDB Index

Trường `title` đã được đánh chỉ mục (index) trong schema definition:
```typescript
@Prop({ required: true, index: true })
title: string;
```

Điều này giúp tối ưu hóa các truy vấn tìm kiếm theo title, đặc biệt là truy vấn regex trong Query 3.

---

## How to Run

1. Start the server:
```bash
cd server
npm install
npm run start:dev
```

2. Seed the database:
```bash
POST http://localhost:3226/books/seed
```

3. Test queries:
```bash
# Books created this year
GET http://localhost:3226/books/query/created-this-year

# Authors with 5+ books
GET http://localhost:3226/books/query/authors-with-5-books

# Programming books in Technology
GET http://localhost:3226/books/query/programming-technology

# Specific fields
GET http://localhost:3226/books/query/specific-fields
```

---

## Database ERD

```
┌─────────────────────────┐
│         Books           │
├─────────────────────────┤
│ _id: ObjectId (PK)      │
│ title: String [indexed] │
│ author_first_name: Str  │
│ author_last_name: Str   │
│ publishing_year: Number │
│ category: String        │
│ num_of_favorites: Num   │
│ description: String     │
│ isbn: String            │
│ created_at: Date        │
│ updated_at: Date        │
└─────────────────────────┘
```
