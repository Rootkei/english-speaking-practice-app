---
description: Deploy Python Flask API lên Render
---

# Deploy Python Flask API lên Render

Hướng dẫn này sẽ giúp bạn deploy ứng dụng Flask API lên Render.com.

## Bước 1: Chuẩn bị các file cần thiết

### 1.1. Tạo file `render.yaml` (Optional - cho Blueprint)

File này giúp Render tự động cấu hình service của bạn:

```yaml
services:
  - type: web
    name: english-speaking-api
    env: python
    region: singapore
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: FLASK_ENV
        value: production
      - key: GROQ_API_KEY
        sync: false
      - key: ALLOWED_ORIGINS
        value: https://your-frontend-url.com
      - key: SECRET_KEY
        generateValue: true
```

### 1.2. Kiểm tra `requirements.txt`

Đảm bảo file `server/requirements.txt` có đầy đủ dependencies:

```
Flask==3.0.0
Flask-CORS==4.0.0
Flask-Limiter==3.5.0
python-dotenv==1.0.0
requests==2.31.0
gunicorn==21.2.0
```

### 1.3. Tạo file `Procfile` (Optional)

```
web: gunicorn app:app
```

## Bước 2: Chuẩn bị Git Repository

### 2.1. Đảm bảo code đã được commit

```bash
cd c:\Mine\test\server
git add .
git commit -m "Prepare for Render deployment"
```

### 2.2. Push lên GitHub (nếu chưa có)

```bash
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

**Lưu ý:** Nếu bạn muốn deploy cả project (không chỉ folder server), bạn có thể push toàn bộ repo. Render sẽ cho phép chỉ định root directory.

## Bước 3: Deploy trên Render

### 3.1. Tạo tài khoản Render

1. Truy cập https://render.com
2. Đăng ký tài khoản mới hoặc đăng nhập bằng GitHub

### 3.2. Tạo Web Service mới

1. Click **"New +"** → **"Web Service"**
2. Kết nối với GitHub repository của bạn
3. Chọn repository chứa code Flask

### 3.3. Cấu hình Web Service

**Basic Settings:**
- **Name:** `english-speaking-api` (hoặc tên bạn muốn)
- **Region:** Singapore (hoặc gần bạn nhất)
- **Branch:** `main`
- **Root Directory:** `server` (nếu code Flask nằm trong folder server)
- **Runtime:** `Python 3`

**Build & Deploy:**
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

**Instance Type:**
- Chọn **Free** (hoặc plan phù hợp)

### 3.4. Thêm Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Thêm các biến sau:

| Key | Value |
|-----|-------|
| `FLASK_ENV` | `production` |
| `GROQ_API_KEY` | `your-groq-api-key-here` |
| `ALLOWED_ORIGINS` | `https://your-frontend-url.com` |
| `SECRET_KEY` | `your-secret-key-here` |
| `PORT` | `10000` (Render tự động set) |

**Lưu ý quan trọng:**
- `GROQ_API_KEY`: Lấy từ https://console.groq.com
- `ALLOWED_ORIGINS`: URL của frontend (có thể nhiều URL cách nhau bằng dấu phẩy)
- `SECRET_KEY`: Tạo random string an toàn

### 3.5. Deploy

1. Click **"Create Web Service"**
2. Render sẽ tự động build và deploy
3. Đợi vài phút để quá trình hoàn tất

## Bước 4: Kiểm tra Deployment

### 4.1. Xem Logs

- Trong Render Dashboard, click vào service
- Chọn tab **"Logs"** để xem quá trình deploy

### 4.2. Test API

Sau khi deploy thành công, bạn sẽ có URL dạng:
```
https://english-speaking-api.onrender.com
```

Test các endpoint:

```bash
# Test root endpoint
curl https://your-app.onrender.com/

# Test health endpoint
curl https://your-app.onrender.com/api/health

# Test generate sentences
curl -X POST https://your-app.onrender.com/api/generate-sentences \
  -H "Content-Type: application/json" \
  -d '{"word": "hello", "count": 3}'
```

## Bước 5: Cập nhật Frontend

Cập nhật file `config.js` trong frontend để trỏ đến Render URL:

```javascript
const config = {
  API_URL: 'https://your-app.onrender.com'
};
```

## Lưu ý quan trọng

### Free Tier Limitations

- **Cold Start:** Service sẽ sleep sau 15 phút không hoạt động
- **Spin-up Time:** Có thể mất 30-60 giây để wake up
- **Monthly Hours:** 750 giờ miễn phí/tháng

### Giải pháp Cold Start

Có thể dùng cron job hoặc uptime monitoring để ping service định kỳ:

```bash
# Ping mỗi 10 phút
*/10 * * * * curl https://your-app.onrender.com/api/health
```

### Bảo mật

1. **Không commit `.env`** vào Git
2. **Sử dụng Environment Variables** trên Render
3. **Giới hạn CORS** chỉ cho phép frontend domain
4. **Rate limiting** đã được cấu hình trong code

## Troubleshooting

### Build Failed

- Kiểm tra `requirements.txt` có đúng format
- Xem logs để tìm package nào bị lỗi
- Đảm bảo Python version tương thích

### Service không start

- Kiểm tra Start Command: `gunicorn app:app`
- Xem logs để tìm lỗi
- Đảm bảo `GROQ_API_KEY` đã được set

### CORS Error

- Kiểm tra `ALLOWED_ORIGINS` environment variable
- Đảm bảo frontend URL được thêm vào

### Rate Limit Issues

- Free tier của Render có thể bị giới hạn requests
- Xem xét nâng cấp plan nếu cần

## Tự động Deploy

### Auto Deploy từ GitHub

Render tự động deploy khi bạn push code mới lên branch `main`:

```bash
git add .
git commit -m "Update API"
git push origin main
```

Render sẽ tự động detect changes và redeploy.

## Monitoring

### Health Check

Render tự động ping endpoint `/` để kiểm tra service health.

Bạn có thể tạo custom health endpoint:

```python
@app.route('/api/health')
def health():
    return {'status': 'healthy', 'timestamp': datetime.now().isoformat()}
```

### Logs

- Xem real-time logs trong Render Dashboard
- Logs được lưu trong 7 ngày (Free tier)

## Nâng cao

### Custom Domain

1. Trong Render Dashboard, chọn service
2. Click **"Settings"** → **"Custom Domain"**
3. Thêm domain của bạn
4. Cấu hình DNS records theo hướng dẫn

### Database

Nếu cần database:

1. Tạo PostgreSQL database trên Render
2. Thêm connection string vào Environment Variables
3. Update code để kết nối database

## Kết luận

Sau khi hoàn thành các bước trên, Flask API của bạn sẽ chạy trên Render với URL công khai. Frontend có thể gọi API thông qua URL này.

**URL mẫu:** `https://english-speaking-api.onrender.com`
