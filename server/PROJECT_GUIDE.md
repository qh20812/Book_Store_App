# Book Store API - Complete Guide

## 🚀 Server Information
- **Base URL**: `http://localhost:3226`
- **Database**: MongoDB Atlas
- **Authentication**: JWT Bearer Token

---

## 📚 Books API

### Base Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/books` | Lấy tất cả sách | No |
| POST | `/books` | Tạo sách mới | No |
| GET | `/books/:id` | Lấy sách theo ID | No |
| PATCH | `/books/:id` | Cập nhật sách | No |
| DELETE | `/books/:id` | Xóa sách | No |
| POST | `/books/seed` | Seed 10 sách mẫu | No |

### Query Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books/query/created-this-year` | Sách tạo trong năm 2026 |
| GET | `/books/query/authors-with-5-books` | Tác giả có ≥ 5 sách |
| GET | `/books/query/programming-technology` | Sách "programming" + "Technology" |
| GET | `/books/query/specific-fields` | Sách với các trường cụ thể |

---

## 👤 Users API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Lấy tất cả users | No |
| POST | `/users` | Tạo user mới | No |
| GET | `/users/:email` | Tìm user theo email | No |

---

## 🔐 Authentication API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Đăng ký user mới | No |
| POST | `/auth/login` | Đăng nhập | No |
| GET | `/auth/me` | Thông tin user hiện tại | Yes (JWT) |
| GET | `/auth/users` | Danh sách users | Yes (Admin) |

---

## 📖 Documentation

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Books API chi tiết
- **[AUTH_USER_DOCUMENTATION.md](AUTH_USER_DOCUMENTATION.md)** - Auth & User API chi tiết
- **[test-api.rest](test-api.rest)** - Test file cho Books API
- **[test-auth-api.rest](test-auth-api.rest)** - Test file cho Auth & User API

---

## 🛠️ Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Server runs at http://localhost:3226
```

---

## ✅ Features

### Books Module
✅ MongoDB schema với Index trên `title`  
✅ Seed 10 books (John Smith có 5 books)  
✅ 4 MongoDB queries đặc biệt (aggregation, regex, projection)  
✅ Full CRUD operations  

### Auth & Users Module
✅ User registration với bcrypt  
✅ Login với JWT  
✅ Role-based access control  
✅ Protected endpoints  

---

**Server running with 0 errors!** ✨
