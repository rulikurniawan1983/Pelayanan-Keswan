# Auto Sync with GitHub Script
# This script will automatically sync all changes with GitHub

Write-Host "🔄 Auto Sync with GitHub" -ForegroundColor Blue
Write-Host "=================================" -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Error "Not a git repository. Please initialize git first."
    exit 1
}

Write-Status "Starting GitHub sync process..."

# Check git status
Write-Status "Checking git status..."
$gitStatus = git status --porcelain
if (-not $gitStatus) {
    Write-Success "No changes to commit. Repository is up to date."
    exit 0
}

# Add all changes
Write-Status "Adding all changes to staging..."
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Success "All changes added to staging"
} else {
    Write-Error "Failed to add changes to staging"
    exit 1
}

# Create commit message with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Auto sync: $timestamp - Pelayanan Keswan updates"

Write-Status "Creating commit with message: $commitMessage"
git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Success "Commit created successfully"
} else {
    Write-Error "Failed to create commit"
    exit 1
}

# Push to GitHub
Write-Status "Pushing changes to GitHub..."
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Success "Changes pushed to GitHub successfully!"
} else {
    Write-Warning "Failed to push to GitHub. Trying to pull first..."
    
    # Try to pull and merge
    Write-Status "Pulling latest changes from GitHub..."
    git pull origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Successfully pulled latest changes"
        
        # Try to push again
        Write-Status "Pushing changes to GitHub again..."
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Changes pushed to GitHub successfully!"
        } else {
            Write-Error "Failed to push to GitHub after pull"
            exit 1
        }
    } else {
        Write-Error "Failed to pull from GitHub"
        exit 1
    }
}

# Show final status
Write-Status "Checking final git status..."
git status --short

Write-Host ""
Write-Host "=================================" -ForegroundColor Blue
Write-Success "GitHub sync completed successfully!"
Write-Host "=================================" -ForegroundColor Blue

# Show recent commits
Write-Host ""
Write-Host "📊 Recent commits:" -ForegroundColor Cyan
git log --oneline -5

Write-Host ""
Write-Host "🌐 GitHub Repository:" -ForegroundColor Cyan
Write-Host "https://github.com/rulikurniawan1983/Pelayanan-Keswan" -ForegroundColor Yellow

Write-Host ""
Read-Host "Press Enter to exit"
