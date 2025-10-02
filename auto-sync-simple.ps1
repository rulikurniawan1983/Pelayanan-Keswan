# Simple Auto Sync with GitHub
# This script will automatically sync changes with GitHub

Write-Host "🔄 Auto Sync with GitHub" -ForegroundColor Blue
Write-Host "=========================" -ForegroundColor Blue

# Check git status
$gitStatus = git status --porcelain
if (-not $gitStatus) {
    Write-Host "[SUCCESS] No changes to commit. Repository is up to date." -ForegroundColor Green
    exit 0
}

# Add all changes
Write-Host "[INFO] Adding all changes to staging..." -ForegroundColor Blue
git add .

# Create commit message with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Auto sync: $timestamp - Pelayanan Keswan updates"

Write-Host "[INFO] Creating commit with message: $commitMessage" -ForegroundColor Blue
git commit -m $commitMessage

# Push to GitHub
Write-Host "[INFO] Pushing changes to GitHub..." -ForegroundColor Blue
git push origin main

Write-Host "[SUCCESS] GitHub sync completed successfully!" -ForegroundColor Green
Write-Host "Repository: https://github.com/rulikurniawan1983/Pelayanan-Keswan" -ForegroundColor Cyan
