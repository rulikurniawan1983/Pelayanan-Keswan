# Start Application with Auto Sync
# This script will start the application and enable auto-sync with GitHub

Write-Host "🚀 Start Application with Auto Sync" -ForegroundColor Blue
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

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Error "Not a git repository. Please initialize git first."
    exit 1
}

# Function to sync with GitHub
function Sync-WithGitHub {
    Write-Status "Syncing with GitHub..."
    
    # Check git status
    $gitStatus = git status --porcelain
    if (-not $gitStatus) {
        Write-Success "No changes to commit. Repository is up to date."
        return $true
    }
    
    # Add all changes
    Write-Status "Adding all changes to staging..."
    git add .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to add changes to staging"
        return $false
    }
    Write-Success "All changes added to staging"
    
    # Create commit message with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "Auto sync: $timestamp - Pelayanan Keswan updates"
    
    Write-Status "Creating commit with message: $commitMessage"
    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create commit"
        return $false
    }
    Write-Success "Commit created successfully"
    
    # Push to GitHub
    Write-Status "Pushing changes to GitHub..."
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Failed to push to GitHub. Trying to pull first..."
        
        # Try to pull and merge
        Write-Status "Pulling latest changes from GitHub..."
        git pull origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to pull from GitHub"
            return $false
        }
        Write-Success "Successfully pulled latest changes"
        
        # Try to push again
        Write-Status "Pushing changes to GitHub again..."
        git push origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to push to GitHub after pull"
            return $false
        }
    }
    
    Write-Success "Changes pushed to GitHub successfully!"
    return $true
}

# Initial sync
Write-Status "Performing initial sync..."
if (Sync-WithGitHub) {
    Write-Success "Initial sync completed successfully!"
} else {
    Write-Error "Initial sync failed!"
    exit 1
}

# Start the application
Write-Status "Starting Pelayanan Keswan application..."
Write-Status "Opening index.html in default browser..."

# Open the main application
Start-Process "index.html"

Write-Success "Application started successfully!"

# Start background sync process
Write-Status "Starting background sync process..."
Write-Status "This will sync changes every 30 seconds..."

# Start background job for sync
$syncJob = Start-Job -ScriptBlock {
    while ($true) {
        try {
            # Check if there are any changes
            $gitStatus = git status --porcelain
            if ($gitStatus) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                Write-Host "[$timestamp] Changes detected. Syncing with GitHub..."
                
                # Add all changes
                git add .
                if ($LASTEXITCODE -eq 0) {
                    # Create commit message
                    $commitMessage = "Auto sync: $timestamp - Pelayanan Keswan updates"
                    git commit -m $commitMessage
                    if ($LASTEXITCODE -eq 0) {
                        # Push to GitHub
                        git push origin main
                        if ($LASTEXITCODE -eq 0) {
                            Write-Host "[$timestamp] Sync completed successfully!"
                        } else {
                            Write-Host "[$timestamp] Failed to push to GitHub"
                        }
                    } else {
                        Write-Host "[$timestamp] Failed to create commit"
                    }
                } else {
                    Write-Host "[$timestamp] Failed to add changes to staging"
                }
            }
        } catch {
            Write-Host "[$timestamp] Error during sync: $($_.Exception.Message)"
        }
        
        # Wait for 30 seconds before next check
        Start-Sleep -Seconds 30
    }
}

Write-Success "Background sync process started!"
Write-Status "Sync job ID: $($syncJob.Id)"

# Show status
Write-Host ""
Write-Host "=====================================" -ForegroundColor Blue
Write-Success "Application started with auto-sync enabled!"
Write-Host "=====================================" -ForegroundColor Blue
Write-Host ""
Write-Host "📱 Application: Pelayanan Keswan" -ForegroundColor Cyan
Write-Host "🔄 Auto-sync: Every 30 seconds" -ForegroundColor Cyan
Write-Host "🌐 GitHub: https://github.com/rulikurniawan1983/Pelayanan-Keswan" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the application and sync process" -ForegroundColor Yellow

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Clean up
    Write-Status "Stopping background sync process..."
    Stop-Job $syncJob
    Remove-Job $syncJob
    Write-Success "Application and sync process stopped."
}
