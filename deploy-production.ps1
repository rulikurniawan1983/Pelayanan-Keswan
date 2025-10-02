# Production Deploy Script for Vercel
# This script will deploy the application to production

Write-Host "🚀 Production Deploy to Vercel" -ForegroundColor Blue
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

# Check if we're in the right directory
if (-not (Test-Path "index.html")) {
    Write-Error "index.html not found. Please run this script from the project root directory."
    exit 1
}

Write-Success "Project files found"

# Use production configuration
Write-Status "Using production configuration..."
Copy-Item "vercel-production.json" "vercel.json" -Force
Write-Success "Production configuration applied"

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    if (-not $vercelVersion) {
        throw "Vercel CLI not found"
    }
    Write-Success "Vercel CLI found: $vercelVersion"
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
    Write-Success "Logged in as: $vercelUser"
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

# Deploy to Vercel Production
Write-Status "Deploying to Vercel Production..."
Write-Status "Configuration: Production build with static files"

try {
    $deployResult = vercel --prod --yes 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Successfully deployed to Vercel Production!"
        Write-Host ""
        Write-Host "🌐 Your application is now live in production!" -ForegroundColor Green
        Write-Host "📱 Check your Vercel dashboard for the URL" -ForegroundColor Cyan
        Write-Host "🔧 Run 'vercel ls' to see all deployments" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Production URL: https://pelayanan-keswan.vercel.app" -ForegroundColor Yellow
    } else {
        Write-Error "Failed to deploy to Vercel Production"
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $deployResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Error "Error during deployment: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Blue
Write-Success "Production deployment completed!"
Write-Host "=================================" -ForegroundColor Blue

# Show deployment info
Write-Host ""
Write-Host "📊 Deployment Information:" -ForegroundColor Cyan
Write-Host "• Environment: Production" -ForegroundColor White
Write-Host "• Build: Static files" -ForegroundColor White
Write-Host "• Framework: None" -ForegroundColor White
Write-Host "• Regions: sin1, hnd1" -ForegroundColor White
Write-Host "• Security: Headers enabled" -ForegroundColor White

Write-Host ""
Read-Host "Press Enter to exit"
