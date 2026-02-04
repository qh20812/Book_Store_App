# Authentication & User Module Documentation

## Tổng Quan

Module Authentication và User được xây dựng với NestJS, MongoDB, JWT và bcrypt. Hệ thống bao gồm:

- 🔐 Đăng ký và đăng nhập với JWT
- 👥 Quản lý người dùng
- 🛡️ Role-based access control (RBAC)
- 🔒 Password hashing với bcrypt

## Cấu Trúc Database

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase, trimmed),
  password: String (hashed with bcrypt),
  full_name: String,
  role: String (enum: 'admin' | 'user'),
  created_at: Date,
  updated_at: Date
}
```

## API Endpoints

### Authentication Endpoints

#### 1. Đăng Ký (Register)
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "1d"
}
```

**Validation:**
- Email phải hợp lệ
- Full name: 1-100 ký tự
- Password: 8-255 ký tự

---

#### 2. Đăng Nhập (Login)
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "1d"
}
```

**Errors:**
- `401 Unauthorized`: Email hoặc password không đúng

---

#### 3. Lấy Thông Tin User Hiện Tại
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "roles": ["user"]
}
```

---

#### 4. Lấy Danh Sách Users (Admin Only)
**GET** `/auth/users`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
[
  {
    "_id": "...",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "createdAt": "2026-02-05T...",
    "updatedAt": "2026-02-05T..."
  }
]
```

**Note:** Endpoint này yêu cầu role `admin`. Sử dụng `@Roles('admin')` decorator.

---

### User Endpoints

#### 1. Lấy Tất Cả Users
**GET** `/users`

**Response:**
```json
[
  {
    "_id": "...",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "createdAt": "2026-02-05T...",
    "updatedAt": "2026-02-05T..."
  }
]
```

---

#### 2. Tạo User Mới
**POST** `/users`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "full_name": "Jane Smith",
  "password": "securepass123"
}
```

**Response:** User object được tạo

---

#### 3. Tìm User Theo Email
**GET** `/users/:email`

**Example:** `GET /users/user@example.com`

**Response:**
```json
{
  "_id": "...",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user"
}
```

---

## Security Features

### 1. Password Hashing
- Sử dụng **bcrypt** với salt rounds = 10
- Password không bao giờ được lưu dạng plain text
- Mỗi password được hash với salt ngẫu nhiên

### 2. JWT Authentication
- Token được sign với secret key
- Expires sau 1 ngày (configurable)
- Payload chứa: `sub` (user ID), `email`, `roles`

### 3. Role-Based Access Control

#### RolesGuard
- Kiểm tra JWT token trong Authorization header
- Verify token và extract roles
- So sánh với required roles từ `@Roles()` decorator

#### Sử dụng:
```typescript
@UseGuards(RolesGuard)
@Roles('admin')
@Get('admin-only')
adminEndpoint() {
  // Only users with 'admin' role can access
}
```

### 4. JwtAuthGuard
- Verify JWT token validity
- Extract và attach user info vào request object
- Throw UnauthorizedException nếu token invalid

#### Sử dụng:
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
protectedEndpoint(@Req() req: Request) {
  const user = req['user']; // Contains JWT payload
}
```

---

## Configuration

File [constant.ts](src/constant.ts):

```typescript
export const JWT_SECRET = 'book-store-auth-secret-keep-it-same-in-both-services';
export const JWT_EXPIRES = '1d';
export const MONGO_URL = 'mongodb+srv://...';
export const PORT = 3226;
```

**⚠️ Important:** Trong production, JWT_SECRET nên được lưu trong environment variables!

---

## Module Structure

### AuthModule
```typescript
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule]
})
```

### UsersModule
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // Export để AuthModule có thể sử dụng
})
```

---

## Testing Flow

### 1. Đăng ký user mới
```bash
POST http://localhost:3226/auth/register
{
  "email": "test@example.com",
  "full_name": "Test User",
  "password": "password123"
}
```

### 2. Đăng nhập
```bash
POST http://localhost:3226/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Copy access_token từ response

### 4. Test protected endpoint
```bash
GET http://localhost:3226/auth/me
Authorization: Bearer {paste_token_here}
```

---

## User Roles

### Default Role
- Khi đăng ký, user mặc định có role `user`

### Admin Role
- Để tạo admin, cần update trực tiếp trong database:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Role Enum
```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
```

---

## Error Handling

### Common Errors

1. **409 Conflict** - Email already registered
2. **401 Unauthorized** - Invalid credentials hoặc token
3. **403 Forbidden** - Insufficient role (không đủ quyền)
4. **400 Bad Request** - Validation errors

### Example Error Response
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

## DTOs (Data Transfer Objects)

### CreateUserDto / RegisterDto
```typescript
{
  email: string;      // Valid email format
  full_name: string;  // 1-100 characters
  password: string;   // 8-255 characters
}
```

### LoginDto
```typescript
{
  email: string;      // Valid email format
  password: string;   // 8-255 characters
}
```

### UpdateUserDto
```typescript
// Partial<CreateUserDto> - All fields optional
{
  email?: string;
  full_name?: string;
  password?: string;
}
```

---

## Best Practices

### 1. Password Security
✅ Always hash passwords before storing  
✅ Use strong passwords (min 8 characters)  
✅ Never log or expose passwords  

### 2. JWT Token
✅ Store token securely on client (HttpOnly cookies preferred)  
✅ Include token in Authorization header: `Bearer {token}`  
✅ Handle token expiration gracefully  

### 3. Role Checking
✅ Always verify roles on backend  
✅ Don't trust client-side role checks  
✅ Use Guards for consistent authorization  

### 4. Error Messages
✅ Don't reveal if email exists (for login/register)  
✅ Use generic "Invalid credentials" message  
✅ Log detailed errors server-side only  

---

## Examples

### Complete Registration Flow
```typescript
// 1. Register
const registerResponse = await fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    full_name: 'John Doe',
    password: 'secure123'
  })
});

const { access_token } = await registerResponse.json();

// 2. Use token for authenticated requests
const meResponse = await fetch('/auth/me', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

const userData = await meResponse.json();
console.log(userData); // { sub: "...", email: "...", roles: [...] }
```

---

## Development Notes

- Server runs on port **3226**
- MongoDB connection is configured in app.module.ts
- All API endpoints are prefixed with their controller path
- Validation pipes are enabled globally (recommended)

---

## Next Steps

1. ✅ Test all endpoints using [test-auth-api.rest](test-auth-api.rest)
2. ✅ Create admin user in database
3. ✅ Test role-based access control
4. 🔄 Implement refresh token (optional)
5. 🔄 Add email verification (optional)
6. 🔄 Add password reset functionality (optional)

---

## Support

Nếu gặp vấn đề:
1. Kiểm tra MongoDB connection
2. Verify JWT_SECRET được set đúng
3. Đảm bảo bcrypt và @nestjs/jwt đã được cài đặt
4. Check console logs cho detailed errors
