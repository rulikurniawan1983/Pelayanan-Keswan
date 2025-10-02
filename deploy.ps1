# Deploy Pelayanan Keswan to Vercel
# PowerShell script for Windows

Write-Host "🚀 Starting deployment process..." -ForegroundColor Blue
Write-Host "=====================================" -ForegroundColor Blue

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

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Status "Initializing git repository..."
    git init
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Git repository initialized"
    } else {
        Write-Error "Failed to initialize git repository"
        exit 1
    }
}

# Check if remote origin exists
try {
    $originUrl = git remote get-url origin 2>$null
    if (-not $originUrl) {
        Write-Warning "No remote origin found"
        $repoUrl = Read-Host "Enter your GitHub repository URL"
        if ($repoUrl) {
            git remote add origin $repoUrl
            Write-Success "Remote origin added: $repoUrl"
        } else {
            Write-Error "No repository URL provided"
            exit 1
        }
    }
} catch {
    Write-Warning "No remote origin found"
    $repoUrl = Read-Host "Enter your GitHub repository URL"
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Success "Remote origin added: $repoUrl"
    } else {
        Write-Error "No repository URL provided"
        exit 1
    }
}

# Add all files
Write-Status "Adding files to git..."
git add .

# Check if there are changes to commit
$stagedChanges = git diff --staged --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Warning "No changes to commit"
} else {
    # Commit changes
    Write-Status "Committing changes..."
    git commit -m "Update: Ready for deployment to Vercel"
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Changes committed successfully"
    } else {
        Write-Error "Failed to commit changes"
        exit 1
    }
}

# Push to GitHub
Write-Status "Pushing to GitHub..."
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Success "Successfully pushed to GitHub"
} else {
    Write-Error "Failed to push to GitHub"
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    if (-not $vercelVersion) {
        Write-Warning "Vercel CLI not found. Installing..."
        npm install -g vercel
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Vercel CLI installed successfully"
        } else {
            Write-Error "Failed to install Vercel CLI"
            exit 1
        }
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
        Write-Warning "Not logged in to Vercel. Please login..."
        vercel login
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Successfully logged in to Vercel"
        } else {
            Write-Error "Failed to login to Vercel"
            exit 1
        }
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
vercel --prod
if ($LASTEXITCODE -eq 0) {
    Write-Success "Successfully deployed to Vercel!"
    Write-Host ""
    Write-Host "🌐 Your application is now live!" -ForegroundColor Green
    Write-Host "📱 Access your app at the URL provided above" -ForegroundColor Green
    Write-Host "🔧 Check deployment status: vercel ls" -ForegroundColor Cyan
    Write-Host "📊 View logs: vercel logs" -ForegroundColor Cyan
} else {
    Write-Error "Failed to deploy to Vercel"
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Blue
Write-Success "Deployment process completed!"
Write-Host "=====================================" -ForegroundColor Blue
