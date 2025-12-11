# Flask Backend Server

Backend API server cho ứng dụng English Speaking Practice, sử dụng Flask và Groq AI.

## Yêu cầu

- Python 3.9 trở lên
- pip (Python package manager)

## Cài đặt

### 1. Tạo Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Cài đặt Dependencies

```bash
pip install -r requirements.txt
```

### 3. Cấu hình Environment Variables

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` và thêm Groq API key của bạn:

```
GROQ_API_KEY=your-groq-api-key-here
FLASK_ENV=development
PORT=5000
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

## Chạy Server

### Development Mode

```bash
python app.py
```

Server sẽ chạy tại: `http://127.0.0.1:5000`

### Production Mode

```bash
# Set environment
export FLASK_ENV=production  # Linux/Mac
# hoặc
set FLASK_ENV=production  # Windows

# Run with Gunicorn (Linux/Mac only)
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Endpoints

### 1. Generate Sentences

**Endpoint:** `POST /api/generate-sentences`

**Request Body:**
```json
{
  "word": "adventure",
  "maxSentences": 10
}
```

**Response:**
```json
[
  {
    "text": "The adventure began when we crossed the mountain pass.",
    "vietnamese": "Cuộc phiêu lưu bắt đầu khi chúng tôi vượt qua đèo núi.",
    "context": "Travel",
    "contextVietnamese": "Du lịch"
  }
]
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

### 2. Health Check

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "English Practice API",
  "version": "1.0.0"
}
```

## Cấu trúc thư mục

```
server/
├── app.py              # Main Flask application
├── config.py           # Configuration management
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variables template
├── .env               # Environment variables (không commit)
└── routes/
    └── api.py         # API routes
```

## Testing

### Test với curl

```bash
# Test health endpoint
curl https://english-practice-api.info-vinhky.workers.dev/api/health

# Test generate sentences
curl -X POST https://english-practice-api.info-vinhky.workers.dev/api/generate-sentences \
  -H "Content-Type: application/json" \
  -d "{\"word\": \"adventure\", \"maxSentences\": 5}"
```

### Test với Python

```python
import requests

# Test generate sentences
response = requests.post(
    'https://english-practice-api.info-vinhky.workers.dev/api/generate-sentences',
    json={'word': 'adventure', 'maxSentences': 5}
)

print(response.json())
```

## Rate Limiting

API có rate limiting mặc định: **20 requests per minute** per IP address.

Nếu vượt quá giới hạn, bạn sẽ nhận được response:
```json
{
  "error": "Rate limit exceeded"
}
```

## Troubleshooting

### Lỗi: "API key not set"

Đảm bảo bạn đã:
1. Tạo file `.env` từ `.env.example`
2. Thêm `GROQ_API_KEY` vào file `.env`
3. Restart server

### Lỗi: "Module not found"

Chạy lại:
```bash
pip install -r requirements.txt
```

### Lỗi CORS

Kiểm tra `ALLOWED_ORIGINS` trong file `.env` có chứa origin của frontend không.

## Production Deployment

Xem hướng dẫn deploy lên Cloudflare Workers tại: [../workers/README.md](../workers/README.md)
