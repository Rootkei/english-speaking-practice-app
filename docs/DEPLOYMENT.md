# 🚀 Deployment Guide

Complete guide for deploying English Speaking Practice App.

## 📁 Project Structure

```
test/
├── frontend/          → GitHub Pages
├── backend/           → Cloudflare Workers  
├── server/            → Local development only
└── docs/              → Documentation
```

## 🎯 Deployment Overview

1. **Backend** → Cloudflare Workers (API server)
2. **Frontend** → GitHub Pages (static site)
3. Both deployed from the same repository

---

## 🔷 Step 1: Deploy Backend (Cloudflare Workers)

### Option A: Automated Script (Recommended)

```powershell
.\deploy-backend.ps1
```

The script will:
- Check Wrangler installation
- Login to Cloudflare
- Set API key secret
- Deploy to Workers

### Option B: Manual Deployment

```bash
cd backend

# Login (first time only)
wrangler login

# Set API key (first time only)
wrangler secret put GROQ_API_KEY

# Deploy
wrangler deploy
```

### ✅ After Deployment

You'll receive a Workers URL like:
```
https://english-practice-api.abc123.workers.dev
```

**Save this URL!** You'll need it for the frontend.

---

## 🔷 Step 2: Update Frontend Configuration

Edit `frontend/config.js`:

```javascript
const APP_CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'https://english-practice-api.info-vinhky.workers.dev'
        : 'https://english-practice-api.abc123.workers.dev'  // ← Your Workers URL
};
```

---

## 🔷 Step 3: Deploy Frontend (GitHub Pages)

### Option A: Automated Script (Recommended)

```powershell
.\deploy-frontend.ps1
```

The script will:
- Initialize git (if needed)
- Check config.js
- Commit changes
- Push to GitHub
- Guide you through GitHub Pages setup

### Option B: Manual Deployment

```bash
# Initialize git (if not already)
git init

# Add and commit
git add .
git commit -m "Deploy to GitHub Pages"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Push
git branch -M main
git push -u origin main
```

### ✅ Enable GitHub Pages

1. Go to your GitHub repository
2. **Settings** → **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: `main`
5. **Folder**: `/frontend` ← **Important!**
6. Click **Save**

Wait 2-3 minutes for deployment.

Your site will be at: `https://USERNAME.github.io/REPO-NAME/`

---

## 🔷 Step 4: Update CORS (If Needed)

If you get CORS errors, update `backend/wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGINS = "https://USERNAME.github.io"
```

Then redeploy backend:
```bash
cd backend
wrangler deploy
```

---

## ✅ Deployment Checklist

### Backend
- [ ] Wrangler installed: `npm install -g wrangler`
- [ ] Logged in: `wrangler login`
- [ ] API key set: `wrangler secret put GROQ_API_KEY`
- [ ] Deployed: `wrangler deploy`
- [ ] Workers URL saved

### Frontend
- [ ] `config.js` created and updated with Workers URL
- [ ] Changes committed to git
- [ ] Pushed to GitHub
- [ ] GitHub Pages enabled (Source: `main`, Folder: `/frontend`)
- [ ] Site accessible

### Testing
- [ ] Backend health check: `https://english-practice-api.info-vinhky.workers.dev/api/health`
- [ ] Frontend loads: `https://username.github.io/repo-name/`
- [ ] Generate sentences works
- [ ] No CORS errors

---

## 🔧 Troubleshooting

### Backend Issues

**Workers not deploying:**
```bash
# Check login
wrangler whoami

# Check secrets
wrangler secret list

# View logs
wrangler tail
```

**API errors:**
- Verify GROQ_API_KEY is set correctly
- Test endpoint: `curl https://english-practice-api.info-vinhky.workers.dev/api/health`

### Frontend Issues

**GitHub Pages not updating:**
- Wait 2-3 minutes after push
- Check Actions tab on GitHub for deployment status
- Clear browser cache

**CORS errors:**
- Add GitHub Pages URL to `backend/wrangler.toml` → `[vars] ALLOWED_ORIGINS`
- Redeploy backend

**Config not working:**
- Ensure `frontend/config.js` exists (not gitignored in frontend)
- Check Workers URL is correct
- Hard refresh browser (Ctrl+F5)

---

## 📊 Monitoring

### Backend (Cloudflare)

**Real-time logs:**
```bash
cd backend
wrangler tail
```

**Dashboard:**
- Cloudflare Dashboard → Workers & Pages → Your Worker
- View metrics, logs, and analytics

### Frontend (GitHub)

**Deployment status:**
- GitHub repo → Actions tab
- See deployment history and status

---

## 🔄 Updating

### Update Backend

```bash
cd backend
# Make changes to index.js
wrangler deploy
```

### Update Frontend

```bash
# Make changes in frontend/
git add .
git commit -m "Update frontend"
git push
# GitHub Pages auto-deploys
```

---

## 🌐 Custom Domains (Optional)

### Backend (Cloudflare Workers)

1. Cloudflare Dashboard → Workers → Your Worker
2. Triggers → Custom Domains
3. Add domain (e.g., `api.yourdomain.com`)

### Frontend (GitHub Pages)

1. GitHub repo → Settings → Pages
2. Custom domain → Enter your domain
3. Add DNS records as instructed

---

## 💡 Tips

1. **Always deploy backend first**, then update frontend config
2. **Test locally** before deploying
3. **Use scripts** (`deploy-backend.ps1`, `deploy-frontend.ps1`) for easier deployment
4. **Monitor logs** after deployment to catch issues early
5. **Keep secrets safe** - never commit API keys

---

## 📞 Support

- **Backend Issues**: See [backend/README.md](../backend/README.md)
- **Frontend Issues**: See [frontend/README.md](../frontend/README.md)
- **Cloudflare Docs**: https://developers.cloudflare.com/workers/
- **GitHub Pages Docs**: https://docs.github.com/pages

---

**Happy Deploying!** 🎉
