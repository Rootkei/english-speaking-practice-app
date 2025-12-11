# 🎯 English Speaking Practice App

Full-stack application for English speaking practice using AI-generated sentences.

## 📁 Project Structure

```
test/
├── frontend/              # Frontend (GitHub Pages)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── config.js         # Create from config.example.js
│   └── README.md
│
├── backend/               # Backend (Cloudflare Workers)
│   ├── index.js
│   ├── wrangler.toml
│   └── README.md
│
├── server/                # Local development server (Flask)
│   ├── app.py
│   ├── routes/
│   └── README.md
│
└── docs/                  # Documentation
    └── DEPLOYMENT.md
```

## 🚀 Quick Start

### Local Development

**1. Start Backend (Flask)**
```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**2. Start Frontend**
```bash
cd frontend
# Create config.js
copy config.example.js config.js
# Open index.html with Live Server
```

### Production Deployment

**1. Deploy Backend to Cloudflare Workers**
```bash
cd backend
wrangler login
wrangler secret put GROQ_API_KEY
wrangler deploy
```

**2. Deploy Frontend to GitHub Pages**
- Push code to GitHub
- Settings → Pages → Source: `main` branch, `/frontend` folder
- Update `frontend/config.js` with Workers URL

See detailed guides in each directory's README.

## 🔗 Live URLs

- **Frontend**: `https://yourusername.github.io/repo-name/`
- **Backend**: `https://english-practice-api.info-vinhky.workers.dev`

## 📚 Documentation

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Server README](server/README.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## ✨ Features

- 🤖 AI-generated sentences using Groq AI
- 🇻🇳 Vietnamese translations
- 🔊 Text-to-speech pronunciation
- 📚 History and bookmarks
- 🎨 Beautiful glassmorphism UI
- 🌓 Dark/Light theme
- ☕ Buy me coffee support

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Web Speech API
- Deployed on GitHub Pages

### Backend
- Cloudflare Workers (JavaScript)
- Groq AI API (LLaMA 3.3 70B)

### Local Development
- Python/Flask server

## 📝 License

Free to use for personal and educational purposes.

---

**Powered by Groq AI** ⚡ | **Deployed on Cloudflare & GitHub** 🚀
