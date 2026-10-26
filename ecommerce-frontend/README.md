# Ecommerce Frontend

Frontend thương mại điện tử sử dụng React, TypeScript, Vite và Tailwind CSS.
React Router quản lý điều hướng; TanStack Query cung cấp provider cho các truy vấn API sau này.

## Chạy trên máy

Yêu cầu Node.js 24 và npm.

```sh
npm ci
cp .env.example .env
npm run dev
```

Trên PowerShell, dùng `Copy-Item .env.example .env`. Nếu PowerShell chặn npm.ps1, dùng `npm.cmd` thay cho `npm`.
Mở địa chỉ Vite in trong terminal (mặc định http://localhost:5173).

```sh
npm run lint
npm run build
npm run preview
```

## Cấu trúc

```text
ecommerce-frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   ├── SellerLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── pages/
│   │   ├── customer/
│   │   ├── seller/
│   │   ├── admin/
│   │   ├── auth/
│   │   └── NotFoundPage.tsx
│   ├── features/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── wallet/
│   │   └── administration/
│   ├── components/
│   │   ├── ui/
│   │   └── common/
│   ├── services/
│   │   └── api/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── assets/
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── compose.yaml
├── nginx.conf
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
├── index.html
└── README.md
```

- `app`: khởi tạo ứng dụng, router và các provider dùng chung.
- `layouts`: bố cục cho khách hàng, người bán và quản trị viên.
- `pages`: các trang được router hiển thị; ghép các thành phần từ features.
- `features`: logic và thành phần theo nghiệp vụ; có thể thêm components, hooks, services và types khi cần.
- `components/ui`: thành phần giao diện cơ bản tái sử dụng.
- `components/common`: thành phần dùng chung giữa nhiều trang hoặc layout.
- `services/api`: nơi triển khai API client và cấu hình kết nối backend.
- `hooks`, `types`, `utils`: hook, kiểu dữ liệu và hàm tiện ích dùng chung.
- `assets`: tài nguyên được import trong mã nguồn; `public`: tài nguyên phục vụ trực tiếp.

Các thư mục chưa có mã nguồn chứa `.gitkeep` để Git lưu lại cấu trúc.
Tailwind được tích hợp qua `@tailwindcss/vite` và `@import 'tailwindcss'` trong `src/index.css`.
Giữ các file cấu hình TypeScript, ESLint và `index.html` cần thiết của Vite.

## Các trang khung

| Đường dẫn | Trang | Layout |
| --- | --- | --- |
| `/` | Trang chủ khách hàng | MainLayout |
| `/seller` | Tổng quan người bán | SellerLayout |
| `/admin` | Tổng quan quản trị | AdminLayout |
| `/login` | Trang khung đăng nhập | Độc lập |
| Đường dẫn khác | 404 | Độc lập |

Đây là bộ khung dự án: chưa triển khai đăng nhập, phân quyền, dữ liệu sản phẩm hay kết nối API.
Các đường dẫn seller/admin hiện mở để kiểm tra layout; cần bổ sung kiểm tra quyền khi triển khai xác thực.
`VITE_API_BASE_URL` trong `.env.example` chuẩn bị cho API client tương lai, hiện chưa được sử dụng.
Biến `VITE_*` được nhúng vào frontend khi build, chỉ dùng cho cấu hình công khai.

## Docker

```sh
docker compose up --build -d
```

Mở http://localhost:3000. Docker build bằng Node và phục vụ bản build bằng Nginx.
`nginx.conf` hỗ trợ tải trực tiếp hoặc refresh các đường dẫn React Router.
Có thể đặt `VITE_API_BASE_URL` trong `.env` trước khi build; thay đổi giá trị này cần build lại image.
Backend và reverse proxy cho `/api` chưa được cấu hình.

```sh
docker compose down
```
