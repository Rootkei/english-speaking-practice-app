# Backend - Cloudflare Workers

Backend API deployed on Cloudflare Workers.

## 📁 Files

- `index.js` - Cloudflare Workers script
- `wrangler.toml` - Workers configuration

## 🚀 Deployment

### Prerequisites

```bash
npm install -g wrangler
```

### Steps

1. **Login to Cloudflare**
   ```bash
   cd backend
   wrangler login
   ```

2. **Set API Key Secret**
   ```bash
   wrangler secret put GROQ_API_KEY
   ```
   Paste your Groq API key when prompted.

3. **Deploy**
   ```bash
   wrangler deploy
   ```

4. **Save the Workers URL**
   
   After deployment, you'll get a URL like:
   ```
   https://english-practice-api.abc123.workers.dev
   ```
   
   Save this URL - you'll need it for frontend configuration!

### Update CORS (After Frontend Deployment)

Edit `wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGINS = "https://yourusername.github.io"
```

Then redeploy:
```bash
wrangler deploy
```

## 🧪 Testing

### Health Check

```bash
curl https://english-speaking-practice-app.onrender.com/api/health
```

### Generate Sentences

```bash
curl -X POST https://english-speaking-practice-app.onrender.com/api/generate-sentences \
  -H "Content-Type: application/json" \
  -d "{\"word\": \"adventure\", \"maxSentences\": 5}"
```

## 📝 API Endpoints

- `GET /` - API info
- `GET /api/health` - Health check
- `POST /api/generate-sentences` - Generate sentences

## 🔧 Local Development

```bash
wrangler dev
```

Workers will run at `http://localhost:8787`

## 📊 Monitoring

View logs in real-time:
```bash
wrangler tail
```

View metrics in Cloudflare Dashboard:
- Workers & Pages → Your Worker → Metrics

## 🔐 Secrets Management

List secrets:
```bash
wrangler secret list
```

Delete a secret:
```bash
wrangler secret delete GROQ_API_KEY
```

## 📝 Notes

- API key is stored as a secret (not in code)
- CORS is configured via `wrangler.toml`
- Free tier: 100,000 requests/day
