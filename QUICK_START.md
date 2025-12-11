# 🎯 Quick Start Guide

## 📁 New Project Structure

```
test/
├── frontend/              # Deploy to GitHub Pages
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── config.js         # Create from config.example.js
│   └── README.md
│
├── backend/               # Deploy to Cloudflare Workers
│   ├── index.js
│   ├── wrangler.toml
│   └── README.md
│
├── server/                # Local development only
│   └── ... (Flask server)
│
├── docs/                  # Documentation
│   └── DEPLOYMENT.md
│
├── deploy-backend.ps1     # Automated backend deployment
└── deploy-frontend.ps1    # Automated frontend deployment
```

---

## 🚀 Deployment Steps

### 1️⃣ Deploy Backend

```powershell
.\deploy-backend.ps1
```

Or manually:
```bash
cd backend
wrangler login
wrangler secret put GROQ_API_KEY
wrangler deploy
```

**Save the Workers URL!**

### 2️⃣ Update Frontend Config

Edit `frontend/config.js`:
```javascript
const APP_CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'https://english-speaking-practice-app.onrender.com'
        : 'https://YOUR-WORKERS-URL'  // ← Paste your Workers URL
};
```

### 3️⃣ Deploy Frontend

```powershell
.\deploy-frontend.ps1
```

Or manually:
```bash
git init
git add .
git commit -m "Deploy"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Then enable GitHub Pages:
- Settings → Pages
- Source: `main` branch
- Folder: `/frontend`

---

## ✅ That's It!

Your app will be live at:
- **Frontend**: `https://USERNAME.github.io/REPO/`
- **Backend**: `https://english-speaking-practice-app.onrender.com`

---

## 📚 More Info

- [Full Deployment Guide](docs/DEPLOYMENT.md)
- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
