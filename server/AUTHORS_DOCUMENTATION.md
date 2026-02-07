# Authors Module Documentation

## Overview

Module Authors được tích hợp với Books module để quản lý tác giả và tạo mối quan hệ (relationship) giữa sách và tác giả trong MongoDB.

## Database Schema

### Authors Collection
```javascript
{
  _id: ObjectId,
  first_name: String (required),
  last_name: String (required),
  bio: String (optional),
  email: String (optional),
  country: String (optional),
  birth_date: Date (optional),
  created_at: Date,
  updated_at: Date
}
```

### Books Collection (Updated)
```javascript
{
  _id: ObjectId,
  title: String (indexed),
  author: ObjectId (ref: 'Author'), // NEW: Reference to Author
  author_first_name: String, // Legacy field
  author_last_name: String,  // Legacy field
  publishing_year: Number,
  category: String,
  num_of_favorites: Number,
  description: String,
  isbn: String,
  created_at: Date,
  updated_at: Date
}
```

## Relationship

- **One-to-Many**: Một Author có thể có nhiều Books
- **Reference**: Book.author → Author._id (ObjectId reference)
- **Populate**: Sử dụng `.populate('author')` để lấy thông tin author đầy đủ

## API Endpoints

### Authors CRUD

#### 1. Create Author
**POST** `/authors`

**Request:**
```json
{
  "first_name": "Robert",
  "last_name": "Martin",
  "bio": "Clean Code author",
  "email": "robert.martin@example.com",
  "country": "USA",
  "birth_date": "1952-12-05"
}
```

#### 2. Get All Authors
**GET** `/authors`

**Response:**
```json
[
  {
    "_id": "65c...",
    "first_name": "John",
    "last_name": "Smith",
    "bio": "Expert software engineer",
    "email": "john.smith@example.com",
    "country": "USA",
    "createdAt": "2026-02-07T..."
  }
]
```

#### 3. Get Author by ID
**GET** `/authors/:id`

#### 4. Update Author
**PATCH** `/authors/:id`

#### 5. Delete Author
**DELETE** `/authors/:id`

---

### Special Endpoints

#### Get Author Stats
**GET** `/authors/stats`

Trả về thống kê tác giả với số lượng sách và tổng favorites.

**Response:**
```json
[
  {
    "_id": "65c...",
    "first_name": "John",
    "last_name": "Smith",
    "full_name": "John Smith",
    "email": "john.smith@example.com",
    "country": "USA",
    "book_count": 5,
    "total_favorites": 810
  }
]
```

**MongoDB Aggregation:**
```javascript
[
  {
    $lookup: {
      from: 'books',
      localField: '_id',
      foreignField: 'author',
      as: 'books'
    }
  },
  {
    $project: {
      first_name: 1,
      last_name: 1,
      full_name: { $concat: ['$first_name', ' ', '$last_name'] },
      email: 1,
      country: 1,
      book_count: { $size: '$books' },
      total_favorites: { $sum: '$books.num_of_favorites' }
    }
  },
  { $sort: { book_count: -1 } }
]
```

#### Seed Authors
**POST** `/authors/seed`

Tạo 6 tác giả mẫu:
- John Smith (USA)
- Jane Doe (UK)
- Alice Johnson (Canada)
- Bob Wilson (Australia)
- Emily Brown (Ireland)
- Michael Davis (USA)

---

### Books with Authors

#### Get Books with Author Details
**GET** `/books/with-authors`

**Response:**
```json
[
  {
    "_id": "65c...",
    "title": "JavaScript Programming: The Complete Guide",
    "author": {
      "_id": "65c...",
      "first_name": "John",
      "last_name": "Smith",
      "bio": "Expert software engineer",
      "email": "john.smith@example.com",
      "country": "USA"
    },
    "publishing_year": 2024,
    "category": "Technology",
    "num_of_favorites": 150
  }
]
```

**Implementation:**
```typescript
// Populate author when querying
this.bookModel.find().populate('author').exec();
```

#### Get Single Book with Author
**GET** `/books/:id`

Tự động populate author details.

---

## Seeding Order

**IMPORTANT:** Phải seed theo thứ tự này:

1. **Seed Authors First:**
   ```bash
   POST /authors/seed
   ```

2. **Then Seed Books:**
   ```bash
   POST /books/seed
   ```

Books seed sẽ tìm authors trong database và tạo references.

---

## Data Validation

### CreateAuthorDto
```typescript
{
  first_name: string (1-100 chars, required)
  last_name: string (1-100 chars, required)
  bio?: string (max 500 chars)
  email?: string (valid email format)
  country?: string (max 100 chars)
  birth_date?: Date
}
```

### UpdateAuthorDto
Partial<CreateAuthorDto> - All fields optional

---

## MongoDB Operations

### Find Books by Author
```typescript
// Using author ID
bookModel.find({ author: authorId });

// With populate
bookModel.find({ author: authorId }).populate('author');
```

### Count Books by Author
```typescript
bookModel.countDocuments({ author: authorId });
```

### Update All Books by Author
```typescript
bookModel.updateMany(
  { author: oldAuthorId },
  { author: newAuthorId }
);
```

---

## Examples

### Complete Flow

```bash
# 1. Seed authors
POST /authors/seed

# 2. Get all authors to see their IDs
GET /authors

# 3. Seed books (uses author references)
POST /books/seed

# 4. Get books with full author details
GET /books/with-authors

# 5. Get author stats (book count, total favorites)
GET /authors/stats
```

### Create Book with Author Reference

```bash
POST /books
{
  "title": "New Book",
  "author": "65c123456789abcdef123456", # Author ObjectId
  "publishing_year": 2026,
  "category": "Technology",
  "description": "Great book"
}
```

---

## Benefits

### 1. Data Normalization
- Author info stored once, referenced many times
- Easy to update author details globally
- Reduced data redundancy

### 2. Relationship Management
- Clear one-to-many relationship
- Easy to query books by author
- Aggregate statistics per author

### 3. Query Flexibility
```typescript
// Get books only
bookModel.find();

// Get books with author details
bookModel.find().populate('author');

// Get author with book count
authorModel.aggregate([
  { $lookup: { from: 'books', ... } }
]);
```

### 4. Backward Compatibility
- Legacy fields `author_first_name` và `author_last_name` vẫn được giữ
- Existing queries vẫn hoạt động

---

## Module Structure

```
authors/
├── dto/
│   ├── create-author.dto.ts
│   └── update-author.dto.ts
├── entities/
│   └── author.entity.ts (Mongoose Schema)
├── authors.controller.ts
├── authors.service.ts
└── authors.module.ts (exports AuthorsService & MongooseModule)

books/
├── entities/
│   └── book.entity.ts (Updated with author: ObjectId)
├── books.module.ts (imports AuthorsModule)
└── books.service.ts (injects Author model)
```

---

## API Routes Summary

**Authors (7 routes):**
- `POST /authors` - Create
- `GET /authors` - Get all
- `GET /authors/stats` - Statistics
- `POST /authors/seed` - Seed data
- `GET /authors/:id` - Get one
- `PATCH /authors/:id` - Update
- `DELETE /authors/:id` - Delete

**Books (updated):**
- `GET /books/with-authors` - NEW: Get with populated authors
- `GET /books/:id` - Updated: Auto-populates author
- `POST /books/seed` - Updated: Uses author references

---

## Testing

Use [test-authors-api.rest](test-authors-api.rest) to test all endpoints.

**Quick Test:**
```bash
# 1. Seed
POST /authors/seed
POST /books/seed

# 2. Verify relationships
GET /books/with-authors
GET /authors/stats
```

---

## Next Steps

- [ ] Add cascade delete (delete author's books when author deleted)
- [ ] Add search by author name
- [ ] Add pagination for author's books
- [ ] Add author profile with top books
- [ ] Add co-author support (many-to-many)
