# Cloudflare Workers Deployment

Hướng dẫn deploy English Speaking Practice API lên Cloudflare Workers.

## Yêu cầu

- Node.js 16+ và npm
- Tài khoản Cloudflare (miễn phí)
- Wrangler CLI

## Cài đặt Wrangler

```bash
npm install -g wrangler
```

## Đăng nhập Cloudflare

```bash
wrangler login
```

Lệnh này sẽ mở trình duyệt để bạn đăng nhập vào Cloudflare.

## Cấu hình

### 1. Cập nhật wrangler.toml

Mở file `wrangler.toml` và cập nhật:

```toml
name = "english-practice-api"  # Tên worker của bạn
main = "workers/index.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "https://yourdomain.com"  # URL frontend của bạn
```

### 2. Set API Key Secret

API key được lưu dưới dạng secret (không xuất hiện trong code):

```bash
wrangler secret put GROQ_API_KEY
```

Khi được hỏi, paste Groq API key của bạn.

## Development

### Test Locally

```bash
# Chạy worker locally
wrangler dev

# Worker sẽ chạy tại: http://localhost:8787
```

### Test API

```bash
# Health check
curl http://localhost:8787/api/health

# Generate sentences
curl -X POST http://localhost:8787/api/generate-sentences \
  -H "Content-Type: application/json" \
  -d "{\"word\": \"adventure\", \"maxSentences\": 5}"
```

## Deployment

### Deploy lên Cloudflare

```bash
wrangler deploy
```

Sau khi deploy thành công, bạn sẽ nhận được URL như:
```
https://english-practice-api.your-subdomain.workers.dev
```

### Verify Deployment

```bash
# Test production endpoint
curl https://english-practice-api.your-subdomain.workers.dev/api/health
```

## Custom Domain (Optional)

### 1. Thêm Custom Domain

Trong Cloudflare Dashboard:
1. Vào Workers & Pages
2. Chọn worker của bạn
3. Settings → Triggers → Custom Domains
4. Add custom domain (ví dụ: `api.yourdomain.com`)

### 2. Cập nhật Frontend

Cập nhật `config.js` trong frontend với URL mới:

```javascript
const APP_CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'https://english-speaking-practice-app.onrender.com'
        : 'https://api.yourdomain.com'
};
```

## Monitoring

### View Logs

```bash
wrangler tail
```

### Metrics

Xem metrics trong Cloudflare Dashboard:
- Workers & Pages → Your Worker → Metrics

## Troubleshooting

### Lỗi: "API key not set"

Set lại secret:
```bash
wrangler secret put GROQ_API_KEY
```

### Lỗi CORS

Kiểm tra `ALLOWED_ORIGINS` trong `wrangler.toml` hoặc update CORS headers trong `workers/index.js`.

### View Errors

```bash
# Real-time logs
wrangler tail

# Hoặc xem trong Dashboard
```

## Limits (Free Plan)

- 100,000 requests/day
- 10ms CPU time per request
- 128MB memory

Nếu cần nhiều hơn, nâng cấp lên Workers Paid plan ($5/month).

## Update Worker

Sau khi sửa code:

```bash
wrangler deploy
```

## Rollback

```bash
# List deployments
wrangler deployments list

# Rollback to specific deployment
wrangler rollback [deployment-id]
```

## Environment Variables

### List all secrets

```bash
wrangler secret list
```

### Delete a secret

```bash
wrangler secret delete GROQ_API_KEY
```

## Best Practices

1. **Secrets**: Luôn dùng `wrangler secret` cho sensitive data
2. **CORS**: Chỉ allow origins cần thiết
3. **Rate Limiting**: Consider thêm rate limiting nếu cần
4. **Monitoring**: Theo dõi metrics thường xuyên
5. **Error Handling**: Log errors để debug

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Examples](https://developers.cloudflare.com/workers/examples/)
