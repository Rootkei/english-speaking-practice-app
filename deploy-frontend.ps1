# Deploy Frontend to GitHub
# Run from project root: .\deploy-frontend.ps1

Write-Host "🌐 Preparing Frontend for GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📝 Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check if config.js exists in frontend
if (-not (Test-Path "frontend/config.js")) {
    Write-Host "⚠️  frontend/config.js not found!" -ForegroundColor Yellow
    Write-Host "Creating from example..." -ForegroundColor White
    Copy-Item "frontend/config.example.js" "frontend/config.js"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Update frontend/config.js with your Workers URL!" -ForegroundColor Red
    Write-Host "   Edit the file and replace 'https://your-worker.workers.dev'" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Have you updated config.js? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Deployment cancelled. Please update config.js first." -ForegroundColor Red
        exit 1
    }
}

# Add and commit
Write-Host "📦 Staging changes..." -ForegroundColor Cyan
git add .

$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Deploy frontend to GitHub Pages"
}

git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Nothing to commit or commit failed" -ForegroundColor Yellow
}

# Check if remote exists
$remoteUrl = git remote get-url origin 2>$null

if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host ""
    Write-Host "📝 No remote repository configured." -ForegroundColor Yellow
    Write-Host "Please enter your GitHub repository URL:" -ForegroundColor White
    Write-Host "Example: https://github.com/username/repo-name.git" -ForegroundColor Gray
    $repoUrl = Read-Host "Repository URL"
    
    if (-not [string]::IsNullOrWhiteSpace($repoUrl)) {
        git remote add origin $repoUrl
        Write-Host "✅ Remote added" -ForegroundColor Green
    } else {
        Write-Host "❌ No repository URL provided!" -ForegroundColor Red
        exit 1
    }
}

# Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Frontend pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Final steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your GitHub repository" -ForegroundColor White
    Write-Host "2. Settings → Pages" -ForegroundColor White
    Write-Host "3. Source: Deploy from a branch" -ForegroundColor White
    Write-Host "4. Branch: main, Folder: /frontend" -ForegroundColor White
    Write-Host "5. Click Save" -ForegroundColor White
    Write-Host ""
    Write-Host "⏳ GitHub Pages will deploy in 2-3 minutes" -ForegroundColor Yellow
    Write-Host "📍 Your site will be at: https://USERNAME.github.io/REPO-NAME/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host "Check the error messages above." -ForegroundColor Yellow
}
