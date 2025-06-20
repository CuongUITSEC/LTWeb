# API Documentation - Wukudada Fashion Store Backend

## Tổng quan

Đây là tài liệu API cho hệ thống backend của Wukudada Fashion Store - một ứng dụng thương mại điện tử thời trang.

**Base URL:** `http://localhost:9000/api`

## Xác thực

Hệ thống sử dụng JWT (JSON Web Token) để xác thực. Token có thể được gửi qua:
- Header: `Authorization: Bearer <token>`
- Cookie: `authToken`

### Roles
- `customer`: Khách hàng thông thường
- `admin`: Quản trị viên

## 1. Authentication & Users API

### 1.1 Đăng ký
```http
POST /api/users/register
```

**Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "123456",
  "gender": "male",
  "birth": "1990-01-01"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "customer"
  },
  "token": "jwt_token"
}
```

### 1.2 Đăng nhập
```http
POST /api/users/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### 1.3 Đăng xuất
```http
POST /api/users/logout
```
**Yêu cầu:** Bearer Token

### 1.4 Lấy thông tin profile
```http
GET /api/users/profile
```
**Yêu cầu:** Bearer Token

### 1.5 Cập nhật profile
```http
PUT /api/users/update-profile
```
**Yêu cầu:** Bearer Token

**Body:**
```json
{
  "name": "Tên mới",
  "gender": "female",
  "birth": "1992-05-15",
  "address": "123 Nguyễn Huệ",
  "city": "TP.HCM",
  "district": "Quận 1",
  "ward": "Phường Bến Nghé",
  "phone": "0901234567"
}
```

### 1.6 OAuth Google
```http
GET /api/auth/google
```

```http
GET /api/auth/google/callback
```

```http
POST /api/auth/google/mobile
```

### 1.7 OAuth Facebook
```http
GET /api/auth/facebook
```

```http
GET /api/auth/facebook/callback
```

```http
POST /api/auth/facebook/mobile
```

## 2. Products API

### 2.1 Lấy danh sách sản phẩm
```http
GET /api/products?page=1&limit=10
```

**Query Parameters:**
- `collection`: Bộ sưu tập (summer, winter, autumn, spring, man, women)
- `sizes`: Kích thước (S,M,L,XL)
- `color`: Màu sắc (#FF0000,#00FF00)
- `gender`: Giới tính (man, woman, unisex)
- `category`: Danh mục (Áo phông, Quần jean, Váy...)
- `material`: Chất liệu (Cotton, Denim...)
- `price`: Khoảng giá (under-500, 500-1000, 1000-1500, above-1500)
- `sortBy`: Sắp xếp (price_asc, price_desc, newest, name_asc, name_desc)
- `search`: Tìm kiếm theo tên
- `featured`: Sản phẩm nổi bật (true/false)
- `published`: Đã xuất bản (true/false)
- `onSale`: Đang giảm giá (true/false)

**Response:**
```json
{
  "products": [...],
  "page": 1,
  "pages": 5,
  "totalProducts": 50,
  "filters": {
    "appliedFilters": 2,
    "query": {...}
  }
}
```

### 2.2 Lấy chi tiết sản phẩm
```http
GET /api/products/:id
```

### 2.3 Tìm kiếm sản phẩm
```http
GET /api/products/search?query=áo thun
```

### 2.4 Gợi ý tìm kiếm
```http
GET /api/products/suggest?query=áo
```

### 2.5 Sản phẩm tương tự
```http
GET /api/products/similar/:id
```

### 2.6 Sản phẩm bán chạy
```http
GET /api/products/best-sellers
```

### 2.7 Sản phẩm mới
```http
GET /api/products/new-arrivals
```

### 2.8 Tạo sản phẩm (Admin)
```http
POST /api/products
```
**Yêu cầu:** Bearer Token (Admin)

**Body:**
```json
{
  "name": "Áo thun nam basic",
  "description": "Áo thun cotton cao cấp",
  "price": 299000,
  "discountPrice": 249000,
  "countInStock": 50,
  "sku": "AT-NAM-001",
  "category": "Áo phông",
  "sizes": ["S", "M", "L", "XL"],
  "colors": [
    {
      "name": "Đen",
      "code": "#000000"
    }
  ],
  "collection": "summer",
  "material": "100% Cotton",
  "gender": "man",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "altText": "Áo thun nam đen"
    }
  ],
  "dimensions": {
    "length": 70,
    "width": 52,
    "height": 1,
    "weight": 0.2
  }
}
```

### 2.9 Cập nhật sản phẩm (Admin)
```http
PUT /api/products/:id
```
**Yêu cầu:** Bearer Token (Admin)

### 2.10 Xóa sản phẩm (Admin)
```http
DELETE /api/products/:id
```
**Yêu cầu:** Bearer Token (Admin)

## 3. Cart API

### 3.1 Thêm vào giỏ hàng
```http
POST /api/cart
```

**Body:**
```json
{
  "productId": "product_id",
  "quantity": 2,
  "size": "M",
  "color": {
    "name": "Đen",
    "code": "#000000"
  },
  "guestId": "guest_123",
  "userId": "user_id"
}
```

### 3.2 Cập nhật giỏ hàng
```http
PUT /api/cart
```

### 3.3 Xóa khỏi giỏ hàng
```http
DELETE /api/cart
```

### 3.4 Lấy giỏ hàng
```http
GET /api/cart?userId=user_id&guestId=guest_id
```

### 3.5 Gộp giỏ hàng (khi đăng nhập)
```http
POST /api/cart/merge
```
**Yêu cầu:** Bearer Token

**Body:**
```json
{
  "guestId": "guest_123"
}
```

### 3.6 Xóa toàn bộ giỏ hàng
```http
DELETE /api/cart/clear
```

## 4. Collections API

### 4.1 Lấy danh sách bộ sưu tập
```http
GET /api/collections
```

### 4.2 Lấy chi tiết bộ sưu tập
```http
GET /api/collections/:id
```

### 4.3 Lấy sản phẩm theo bộ sưu tập
```http
GET /api/collections/:id/products
```

### 4.4 Tạo bộ sưu tập
```http
POST /api/collections
```

**Body:**
```json
{
  "id": "summer",
  "name": "Summer Collection",
  "bannerUrl": "https://example.com/banner.jpg",
  "description": "Bộ sưu tập mùa hè",
  "categories": ["Áo phông", "Quần short"]
}
```

### 4.5 Cập nhật bộ sưu tập
```http
PUT /api/collections/:id
```

### 4.6 Xóa bộ sưu tập
```http
DELETE /api/collections/:id
```

## 5. Orders API

### 5.1 Tạo đơn hàng
```http
POST /api/orders
```
**Yêu cầu:** Bearer Token

**Body:**
```json
{
  "formData": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "address": "123 Nguyễn Huệ",
    "city": "TP.HCM",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé",
    "postalCode": "70000",
    "country": "Vietnam",
    "notes": "Ghi chú",
    "paymentMethod": "COD"
  },
  "cartItems": [...],
  "totalPrice": 500000
}
```

### 5.2 Lấy đơn hàng của tôi
```http
GET /api/orders/my-orders
```
**Yêu cầu:** Bearer Token

### 5.3 Lấy chi tiết đơn hàng
```http
GET /api/orders/:id
```
**Yêu cầu:** Bearer Token

### 5.4 Cập nhật tồn kho sau khi đặt hàng
```http
PUT /api/orders/:id/update-stock
```
**Yêu cầu:** Bearer Token

## 6. Checkout API

### 6.1 Tạo phiên thanh toán
```http
POST /api/checkout
```
**Yêu cầu:** Bearer Token

### 6.2 Cập nhật trạng thái thanh toán
```http
PUT /api/checkout/:id/pay
```
**Yêu cầu:** Bearer Token

### 6.3 Hoàn tất thanh toán
```http
POST /api/checkout/:id/finalize
```
**Yêu cầu:** Bearer Token

### 6.4 Lấy chi tiết checkout
```http
GET /api/checkout/:id
```
**Yêu cầu:** Bearer Token

## 7. Payment API

### 7.1 Kiểm tra thanh toán
```http
GET /api/payment/check?orderCode=123&amount=500000&phone=0901234567
```

## 8. Upload API

### 8.1 Upload ảnh
```http
POST /api/upload
```
**Content-Type:** multipart/form-data
**Body:** Form data với file ảnh

## 9. Admin APIs

### 9.1 Quản lý Users

#### Lấy danh sách users
```http
GET /api/admin/users
```
**Yêu cầu:** Bearer Token (Admin)

#### Tạo user mới
```http
POST /api/admin
```
**Yêu cầu:** Bearer Token (Admin)

#### Cập nhật user
```http
PUT /api/admin/:id
```
**Yêu cầu:** Bearer Token (Admin)

#### Xóa user
```http
DELETE /api/admin/:id
```
**Yêu cầu:** Bearer Token (Admin)

### 9.2 Quản lý Products

#### Lấy danh sách products (Admin)
```http
GET /api/admin/products
```
**Yêu cầu:** Bearer Token (Admin)

### 9.3 Quản lý Orders

#### Lấy danh sách orders
```http
GET /api/admin/orders
```
**Yêu cầu:** Bearer Token (Admin)

#### Cập nhật trạng thái order
```http
PUT /api/admin/orders/:id
```
**Yêu cầu:** Bearer Token (Admin)

**Body:**
```json
{
  "status": "Shipped",
  "paymentStatus": "Paid"
}
```

#### Xóa order
```http
DELETE /api/admin/orders/:id
```
**Yêu cầu:** Bearer Token (Admin)

## 10. Error Responses

Tất cả lỗi đều trả về format sau:

```json
{
  "message": "Thông báo lỗi",
  "error": "Chi tiết lỗi (chỉ trong development)"
}
```

### Mã lỗi thường gặp:
- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Chưa xác thực
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Không tìm thấy tài nguyên
- `500`: Internal Server Error - Lỗi server

## 11. Rate Limiting

- Giới hạn: 100,000,000 requests/15 phút/IP
- Áp dụng cho tất cả `/api/*` endpoints

## 12. CORS

Hỗ trợ CORS cho:
- `http://localhost:5173`
- `http://localhost:3000`
- Tất cả subdomain `.vercel.app`

## 13. File Upload

- Hỗ trợ upload qua Cloudinary
- Format hỗ trợ: JPG, PNG, WEBP
- Kích thước tối đa: Theo cấu hình Cloudinary

## 14. Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  role: "customer" | "admin",
  gender: "male" | "female" | "other",
  birth: Date,
  address: String,
  city: String,
  district: String,
  ward: String,
  phone: String,
  googleId: String,
  facebookId: String,
  profileImage: String,
  accountType: "local" | "google" | "facebook" | "hybrid"
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  countInStock: Number,
  sku: String (unique),
  category: String,
  sizes: [String],
  colors: [{name: String, code: String}],
  collection: String,
  material: String,
  gender: "man" | "woman" | "unisex",
  images: [{url: String, altText: String}],
  isPublished: Boolean,
  rating: Number (0-5),
  numReviews: Number,
  tags: [String],
  user: ObjectId,
  dimensions: {length, width, height, weight}
}
```

### Cart Model
```javascript
{
  user: ObjectId,
  guestId: String,
  products: [{
    productId: ObjectId,
    name: String,
    image: String,
    price: Number,
    size: String,
    color: {name: String, code: String},
    quantity: Number
  }],
  totalPrice: Number
}
```

### Order Model
```javascript
{
  user: ObjectId,
  orderItems: [{
    productId: ObjectId,
    name: String,
    image: String,
    price: Number,
    size: String,
    color: String,
    quantity: Number
  }],
  shippingAddress: {
    address: String,
    city: String,
    district: String,
    ward: String,
    postalCode: String,
    country: String,
    notes: String
  },
  paymentMethod: String,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  paymentStatus: String,
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
}
```

## 15. Environment Variables

```bash
# Server
PORT=9000

# Database
MONGO_URI=mongodb://...

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=...

# Facebook OAuth
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_CALLBACK_URL=...

# Session
SESSION_SECRET=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Frontend
FRONTEND_URL=http://localhost:5173
```