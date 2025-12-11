# Deploy Backend to Cloudflare Workers
# Run from project root: .\deploy-backend.ps1

Write-Host "🚀 Deploying Backend to Cloudflare Workers..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location backend

# Check if wrangler is installed
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Wrangler is not installed." -ForegroundColor Red
    Write-Host "Installing wrangler..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Check login status
Write-Host "📝 Checking Cloudflare login status..." -ForegroundColor Yellow
wrangler whoami 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Not logged in. Opening login page..." -ForegroundColor Yellow
    wrangler login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

Write-Host "✅ Logged in to Cloudflare" -ForegroundColor Green
Write-Host ""

# Check if API key secret is set
Write-Host "🔑 Checking API key secret..." -ForegroundColor Yellow
$secrets = wrangler secret list 2>$null

if ($secrets -notmatch "GROQ_API_KEY") {
    Write-Host "⚠️  GROQ_API_KEY secret not found!" -ForegroundColor Yellow
    Write-Host "Please set it now:" -ForegroundColor White
    wrangler secret put GROQ_API_KEY
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to set API key!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

Write-Host "✅ API key configured" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "📦 Deploying to Cloudflare Workers..." -ForegroundColor Cyan
wrangler deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy the Workers URL from above" -ForegroundColor White
    Write-Host "2. Update frontend/config.js with the Workers URL" -ForegroundColor White
    Write-Host "3. Commit and push to deploy frontend" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Test your API:" -ForegroundColor Yellow
    Write-Host "   curl https://your-worker.workers.dev/api/health" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the error messages above." -ForegroundColor Yellow
}

# Return to project root
Set-Location ..
