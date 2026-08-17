# 🚀 Portfolio Production Deployment Guide

Hướng dẫn chi tiết từng bước chuẩn bị và triển khai dự án Portfolio lên môi trường Production (VPS Docker / Cloud).

---

## 📋 1. Danh sách Biến Môi trường Cần thiết (Checklist)

Tạo file `.env` trên server production dựa theo template `.env.production.example`:

| Biến Môi trường | Ý nghĩa / Mô tả | Ví dụ |
| :--- | :--- | :--- |
| `MONGO_URI` | Chuỗi kết nối MongoDB | `mongodb://mongodb:27017/portfolio` hoặc `mongodb+srv://...` |
| `JWT_ACCESS_SECRET` | Khóa bí mật ký Access Token (min 32 ký tự) | Tạo bằng `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Khóa bí mật ký Refresh Token (min 32 ký tự) | Tạo bằng `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Email đăng nhập Admin duy nhất | `admin@tranhieu.dev` |
| `ADMIN_PASSWORD` | Mật khẩu tài khoản Master Admin khởi tạo | `StrongPassword@2026!` |
| `CLOUDINARY_CLOUD_NAME`| Tên cloud Cloudinary lưu ảnh | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | API Key Cloudinary | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET` | API Secret Cloudinary | `your_cloudinary_api_secret` |
| `CORS_ORIGIN` | Các domain được phép gọi API (cách nhau dấu phẩy) | `https://tranhieu.dev,https://www.tranhieu.dev` |
| `VITE_API_URL` | Đường dẫn Backend API cho Frontend | `https://api.tranhieu.dev/api/v1` |

---

## 🐳 2. Cách 1: Triển khai trên VPS với Docker Compose (Khuyên dùng)

### Bước 2.1: Clone source code về VPS
```bash
git clone https://github.com/tran-hius/portfolio.git
cd portfolio
```

### Bước 2.2: Thiết lập file `.env`
```bash
cp .env.production.example .env
nano .env  # Điền các thông tin bảo mật thực tế
```

### Bước 2.3: Khởi chạy Production Containers
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Bước 2.4: Kiểm tra trạng thái
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

---

## 🔒 3. Cấu hình Nginx & SSL Miễn phí (Let's Encrypt / Certbot)

Nếu bạn có tên miền riêng (`tranhieu.dev` và `api.tranhieu.dev`):

### Cài đặt Nginx & Certbot trên Host:
```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

### File cấu hình Nginx Reverse Proxy (`/etc/nginx/sites-available/portfolio.conf`):
```nginx
# Frontend SPA
server {
    server_name tranhieu.dev www.tranhieu.dev;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API & Realtime SSE
server {
    server_name api.tranhieu.dev;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Realtime SSE Streaming Support
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        chunked_transfer_encoding off;
        proxy_buffering off;
        proxy_cache off;
    }
}
```

### Kích hoạt và cấp phát chứng chỉ SSL:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d tranhieu.dev -d www.tranhieu.dev -d api.tranhieu.dev
```

---

## ☁️ 4. Cách 2: Triển khai Cloud Miễn phí / Serverless

1. **Database**: Tạo Cluster miễn phí trên [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) -> Lấy chuỗi `MONGO_URI`.
2. **Backend**: Deploy lên [Render.com](https://render.com) hoặc [Railway.app](https://railway.app):
   - Build Command: `npm run build`
   - Start Command: `npm run start` (chạy `node dist/index.js`)
   - Thêm các Environment Variables tương ứng.
3. **Frontend**: Deploy lên [Vercel](https://vercel.com) hoặc [Cloudflare Pages](https://pages.cloudflare.com):
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable: `VITE_API_URL=https://<your-backend-domain>/api/v1`

---

## 🛡️ 5. Checklist An ninh & Hiệu năng trước khi Go-Live

- [x] Đã xóa endpoint đăng ký public, chỉ có 1 tài khoản Admin Master.
- [x] Đã xóa mật khẩu fallback hardcoded trong mã nguồn.
- [x] Access Token được bảo vệ qua HttpOnly cookie / In-memory, Refresh Token có cơ chế xoay vòng RTR.
- [x] Đã kích hoạt bảo mật `helmet()` (CSP, anti-clickjacking, no-sniff).
- [x] Đã cấu hình rate-limiting chống Brute-Force đăng nhập.
- [x] Hệ thống giám sát Cluster & Metrics được bảo vệ bằng quyền Admin.
- [x] Frontend được tối ưu hóa với React Lazy Loading (~58 kB main bundle).
