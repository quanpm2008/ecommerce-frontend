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
Mở http://localhost:3000. Cổng 3000 trùng với bản Docker, để liên kết đặt lại mật khẩu
trong email (`identity.password-reset.link-base`) mở đúng ứng dụng.

### Chạy cùng backend

Gateway chưa có route, nên khi dev Vite chuyển tiếp thẳng `/api/v1/identity` sang
identity-service (`http://localhost:8083`, đổi bằng biến môi trường `IDENTITY_URL`), xem `vite.config.ts`.
Chạy identity-service theo `ecommerce/identity-service/RUN.md`, ví dụ kèm một tài khoản quản trị cho dev:

```sh
cd ../../ecommerce/identity-service
IDENTITY_BOOTSTRAP_ADMIN_EMAIL=admin@san.test IDENTITY_BOOTSTRAP_ADMIN_PASSWORD=Admin1234 docker compose up -d
```

UI preview (không cần backend): http://localhost:3000/preview.html (mục I), `#customer` (mục II).

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

## Đường dẫn

| Đường dẫn | Trang | Ghi chú |
| --- | --- | --- |
| `/` | Trang chủ khách hàng (khung tạm) | MainLayout |
| `/login`, `/register` | I.3, I.1 | Đã nối API |
| `/forgot-password`, `/reset-password?token=` | I.6, I.7 | Đã nối API; link trong email trỏ vào đây |
| `/seller` | Tổng quan người bán (khung tạm) | Cần tài khoản người bán đã duyệt |
| `/seller/login`, `/seller/register` | I.4, I.2 | Đã nối API |
| `/admin` | Tổng quan quản trị (khung tạm) | Cần vai trò ADMIN |
| `/admin/login` | I.5 | Đã nối API |
| Đường dẫn khác | 404 | |

Khi dev, ba ứng dụng (khách, người bán, quản trị) chung một bản build và tách theo tiền tố đường dẫn.
Đăng nhập luôn thành công với mọi tài khoản; frontend quyết định ai được vào kênh nào theo hồ sơ trả về
(`src/features/auth/integration.ts`). Backend vẫn kiểm tra quyền ở mọi API.

- `src/services/api/client.ts`: gọi API, đọc envelope `{ data }` / `{ error }`, tự làm mới token.
- `src/services/session.ts`: phiên đăng nhập (lưu localStorage — cân nhắc cookie httpOnly trước khi lên production).
- `src/types/`: type khớp DTO trong `ecommerce/docs/api.docx`.

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
