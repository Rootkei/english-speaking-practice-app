# English Speaking Practice App

## 📁 Project Structure

```
test/
├── frontend/              # 🌐 Frontend files (deployed to GitHub Pages)
│   ├── index.html        # Main HTML file
│   ├── script.js         # JavaScript logic (with topic selector)
│   ├── style.css         # Styles
│   ├── topics.js         # Topic data
│   ├── config.js         # API configuration
│   ├── manifest.json     # PWA manifest
│   ├── service-worker.js # Service worker
│   ├── offline.html      # Offline page
│   ├── icons/            # App icons
│   └── buy-me-coffee.jpg # QR code image
│
├── server/               # 🐍 Backend API (Python Flask)
│   ├── app.py           # Main Flask app
│   ├── routes/          # API routes
│   ├── config.py        # Server configuration
│   └── requirements.txt # Python dependencies
│
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions (deploys from /frontend)
│
└── README.md            # This file
```

## 🚀 Quick Start

### Frontend (Local Development)

```bash
# Open in browser
file:///c:/Mine/test/frontend/index.html

# Or use Live Server
cd frontend
# Start your preferred local server
```

### Backend (Local Development)

```bash
cd server
.\venv\Scripts\Activate.ps1  # Windows
python app.py
# Server runs at http://127.0.0.1:5000
```

## 🌐 Deployment

### Frontend → GitHub Pages
- **Automatic**: Push to `main` branch
- **GitHub Actions** deploys from `/frontend` directory
- **URL**: Your GitHub Pages URL

### Backend → Render
- Use `/server` directory
- See `server/README.md` for deployment instructions

## ✨ Features

- 🎯 **Topic Selector**: Choose specific topics or random
- 🔊 **Text-to-Speech**: Pronunciation support
- 📚 **History & Bookmarks**: Save your progress
- 🌙 **Dark/Light Theme**: Toggle themes
- 📱 **PWA Support**: Install as app
- 🌐 **Offline Support**: Works without internet

## 🛠️ Configuration

### Frontend API Endpoint

Edit `frontend/config.js`:

```javascript
const APP_CONFIG = {
    API_BASE_URL: 'https://your-backend-url.com'
};
```

### Backend Environment

Edit `server/.env`:

```
GROQ_API_KEY=your_groq_api_key
FLASK_ENV=production
```

## 📝 Development Notes

- **Frontend files** are in `/frontend` directory
- **No duplicate files** in root (cleaned up)
- **GitHub Actions** automatically deploys frontend
- **Topic selector** feature fully integrated
- **Strong AI prompts** ensure topic-specific contexts

## 🔗 Links

- **Frontend Repo**: [GitHub](https://github.com/yourusername/yourrepo)
- **Live Demo**: [GitHub Pages URL]
- **API Docs**: See `server/README.md`

## 📄 License

See [LICENSE](LICENSE) file.

---

Made with ❤️ by Nguyen Vinh Ky (Rootkei)