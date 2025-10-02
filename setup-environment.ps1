# Environment Setup Script for PowerShell
# This script helps setup environment variables

Write-Host "🔧 Environment Setup for Pelayanan Keswan" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "⚠️ .env file already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 0
    }
}

# Check if env.example exists
if (-not (Test-Path "env.example")) {
    Write-Host "❌ env.example file not found" -ForegroundColor Red
    Write-Host "Please make sure env.example exists in the current directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Run environment setup
Write-Host "🚀 Starting environment setup..." -ForegroundColor Blue

try {
    # Run the setup script
    node setup-env.js setup
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Environment setup completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Review your .env file" -ForegroundColor White
        Write-Host "2. Update any values if needed" -ForegroundColor White
        Write-Host "3. Run 'npm run dev' to start development" -ForegroundColor White
        Write-Host ""
        
        # Show .env file content (first 10 lines)
        if (Test-Path ".env") {
            Write-Host "📄 .env file preview:" -ForegroundColor Cyan
            Get-Content ".env" | Select-Object -First 10 | ForEach-Object {
                Write-Host "   $_" -ForegroundColor Gray
            }
            Write-Host "   ..." -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Environment setup failed" -ForegroundColor Red
        Write-Host "Please check the error messages above" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error running setup script: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
