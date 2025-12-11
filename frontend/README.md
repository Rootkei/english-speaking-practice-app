# Frontend - English Speaking Practice

Frontend application deployed on GitHub Pages.

## 📁 Files

- `index.html` - Main HTML file
- `style.css` - Styles with design system
- `script.js` - Application logic
- `config.js` - API configuration (create from config.example.js)
- `topics.js` - Topics data
- `buy-me-coffee.jpg` - Coffee support image

## 🚀 Local Development

1. Create `config.js` from example:
   ```bash
   copy config.example.js config.js
   ```

2. Open `index.html` with Live Server or any HTTP server

## 📦 Deployment to GitHub Pages

This directory is automatically deployed to GitHub Pages.

### Setup

1. Go to GitHub repo → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`
4. **Folder: `/frontend`** ← Important!
5. Save

### After Backend Deployment

Update `config.js` with your Cloudflare Workers URL:

```javascript
const APP_CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'https://english-speaking-practice-app.onrender.com'
        : 'https://english-speaking-practice-app.onrender.com'  // ← Your Workers URL
};
```

## 🔗 URLs

- **Local**: `http://localhost:5500` (or your Live Server port)
- **Production**: `https://yourusername.github.io/repo-name/`

## 📝 Notes

- `config.js` is gitignored - create it locally and update for production
- All assets must be in this directory for GitHub Pages
- Backend API calls go through Cloudflare Workers
