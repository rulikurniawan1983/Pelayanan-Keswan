# Simple Deploy Script for Vercel
# This script will deploy the static site to Vercel

Write-Host "🚀 Simple Deploy to Vercel" -ForegroundColor Blue
Write-Host "==========================" -ForegroundColor Blue

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

# Check if we're in the right directory
if (-not (Test-Path "index.html")) {
    Write-Error "index.html not found. Please run this script from the project root directory."
    exit 1
}

Write-Success "Project files found"

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    if (-not $vercelVersion) {
        throw "Vercel CLI not found"
    }
} catch {
    Write-Warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Vercel CLI installed successfully"
    } else {
        Write-Error "Failed to install Vercel CLI"
        exit 1
    }
}

# Check if user is logged in to Vercel
try {
    $vercelUser = vercel whoami 2>$null
    if (-not $vercelUser) {
        throw "Not logged in"
    }
} catch {
    Write-Warning "Not logged in to Vercel. Please login..."
    vercel login
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Successfully logged in to Vercel"
    } else {
        Write-Error "Failed to login to Vercel"
        exit 1
    }
}

# Deploy to Vercel
Write-Status "Deploying to Vercel..."
vercel --prod --yes
if ($LASTEXITCODE -eq 0) {
    Write-Success "Successfully deployed to Vercel!"
    Write-Host ""
    Write-Host "🌐 Your application is now live!" -ForegroundColor Green
    Write-Host "📱 Check your Vercel dashboard for the URL" -ForegroundColor Cyan
    Write-Host "🔧 Run 'vercel ls' to see all deployments" -ForegroundColor Cyan
} else {
    Write-Error "Failed to deploy to Vercel"
    exit 1
}

Write-Host ""
Write-Host "==========================" -ForegroundColor Blue
Write-Success "Deployment completed!"
Write-Host "==========================" -ForegroundColor Blue
