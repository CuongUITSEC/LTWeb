# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# HƯỚNG DẪN XÂY DỰNG VÀ PHÁT TRIỂN FRONTEND

---

## 1. Giới thiệu

Tài liệu này hướng dẫn chi tiết quá trình cài đặt, phát triển, kiểm thử, build và deploy frontend cho dự án sử dụng React + Vite. Phù hợp cho cả người mới bắt đầu và thành viên phát triển dự án.

---

## 2. Yêu cầu hệ thống

- **Node.js**: Khuyến nghị >= 16.x.x ([Tải tại đây](https://nodejs.org/))
- **npm**: Khuyến nghị >= 8.x.x (cài cùng Node.js)

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

---

## 3. Chuẩn bị & Cài đặt

### 3.1. Lấy mã nguồn

Nếu chưa có mã nguồn, clone repository:

```bash
git clone <link-repo>
```

Chuyển vào thư mục frontend:

```bash
cd LTWeb/frontend
```

### 3.2. Cài đặt dependencies

Cài đặt các package cần thiết:

```bash
npm install
```

Lệnh này sẽ tự động cài đặt tất cả thư viện được khai báo trong `package.json`.

---

## 4. Thiết lập biến môi trường

- Dự án có sẵn file `env.txt` chứa ví dụ các biến môi trường. Để sử dụng, bạn có thể copy thành file `.env`:
  ```bash
  cp env.txt .env
  ```
- Một số biến môi trường thường dùng:
  - `VITE_API_URL`: Địa chỉ backend API.
  - `VITE_GOOGLE_CLIENT_ID`: (nếu dùng đăng nhập Google)

Ví dụ file `.env` cho môi trường phát triển:

```
VITE_API_URL=http://localhost:5000/api
```

Ví dụ cho môi trường production:

```
VITE_API_URL=https://your-production-domain.com/api
```

> Không commit file `.env` lên git.

---

## 5. Phát triển & Kiểm thử

### 5.1. Chạy chế độ phát triển với Vite

Khởi động server phát triển:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: [http://localhost:5173](http://localhost:5173) (hoặc cổng hiển thị trên terminal).

### 5.2. Phát triển

- Chỉnh sửa mã nguồn trong thư mục `src/`.
- Trang web sẽ tự động reload khi lưu file.
- Sử dụng DevTools của trình duyệt để debug, kiểm tra network, console log, v.v.

### 5.3. Kiểm tra code với ESLint (nếu có script)

- Nếu có script kiểm tra ESLint trong `package.json`, chạy:
  ```bash
  npm run lint
  ```
- Nếu chưa có, có thể kiểm tra thủ công:
  ```bash
  npx eslint src
  ```
- Cấu hình ESLint nằm ở file `eslint.config.js`.

---

## 6. Build & Deploy

### 6.1. Build production

```bash
npm run build
```

Kết quả build nằm trong thư mục `dist/`.

### 6.2. Kiểm tra bản build

```bash
npm run preview
```

Truy cập địa chỉ hiển thị trên terminal để kiểm tra bản build.

### 6.3. Deploy

- Upload thư mục `dist/` lên server hoặc dịch vụ hosting tĩnh (Vercel, Netlify, Firebase Hosting, ...).
- Cấu hình domain, SSL, và các thiết lập khác nếu cần.

---

## 7. Cấu trúc thư mục chính

```
frontend/
├── public/           # Tài nguyên tĩnh (ảnh, favicon, robots.txt, ...)
├── src/              # Mã nguồn React
│   ├── assets/       # Ảnh, video, dữ liệu mẫu
│   ├── components/   # Các component giao diện
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Các trang chính
│   ├── redux/        # State management
│   ├── services/     # Giao tiếp API
│   ├── utils/        # Tiện ích dùng chung
│   └── index.css     # CSS gốc
├── index.html        # File HTML gốc
├── package.json      # Thông tin & scripts dự án
├── vite.config.js    # Cấu hình Vite
├── eslint.config.js  # Cấu hình ESLint
├── env.txt           # Ví dụ biến môi trường
└── .env              # Biến môi trường thực tế (tự tạo)
```

---

## 8. Các lệnh npm hữu ích

| Lệnh            | Chức năng                           |
| --------------- | ----------------------------------- |
| npm run dev     | Chạy chế độ phát triển (hot reload) |
| npm run build   | Build production                    |
| npm run preview | Xem thử bản build production        |
| npm install     | Cài đặt dependencies                |
| npm run lint    | Kiểm tra code với ESLint (nếu có)   |

---

## 9. Xử lý lỗi thường gặp

- **Lỗi không truy cập được API:** Kiểm tra backend đã chạy và đúng địa chỉ trong biến môi trường.
- **Lỗi CORS:** Backend cần cho phép domain frontend truy cập.
- **Lỗi thiếu package:** Chạy lại `npm install`.
- **Lỗi port đã sử dụng:** Chạy `npm run dev -- --port <port-khac>`.
- **Lỗi không load được ảnh/tài nguyên:** Kiểm tra đường dẫn và file trong `public/`.
- **Lỗi ESLint:** Đọc log, sửa code theo hướng dẫn của ESLint.

---

## 10. Lưu ý khi phát triển

- Luôn chạy `npm install` sau khi pull code mới để cập nhật dependencies.
- Không commit file `.env` hoặc thông tin nhạy cảm lên git.
- Đọc kỹ log lỗi trên terminal và trình duyệt để xác định nguyên nhân khi gặp sự cố.
- Thường xuyên cập nhật dependencies để tránh lỗi bảo mật.
- Kiểm tra kỹ các thay đổi trước khi build và deploy.
- Đọc kỹ file `eslint.config.js` để tuân thủ quy tắc code chung.

---

## 11. Tham khảo thêm

- [Tài liệu React](https://react.dev/)
- [Tài liệu Vite](https://vitejs.dev/)
- [Hướng dẫn deploy Vercel](https://vercel.com/docs)
- [Hướng dẫn deploy Netlify](https://docs.netlify.com/)
- [Tài liệu ESLint](https://eslint.org/docs/latest/)

---

Nếu có thắc mắc hoặc gặp lỗi không giải quyết được, hãy liên hệ quản lý dự án hoặc người phát triển frontend.
