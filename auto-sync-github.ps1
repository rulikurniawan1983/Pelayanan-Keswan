# Auto Sync with GitHub - Continuous Monitoring
# This script will monitor changes and auto-sync with GitHub

Write-Host "🔄 Auto Sync with GitHub - Continuous Mode" -ForegroundColor Blue
Write-Host "=============================================" -ForegroundColor Blue

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
    Write-Status "Starting sync process..."
    
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

# Continuous monitoring
Write-Status "Starting continuous monitoring..."
Write-Status "Press Ctrl+C to stop monitoring"

$lastSync = Get-Date
$syncInterval = 30 # seconds

while ($true) {
    try {
        # Check if there are any changes
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            $timeSinceLastSync = (Get-Date) - $lastSync
            if ($timeSinceLastSync.TotalSeconds -ge $syncInterval) {
                Write-Status "Changes detected. Syncing with GitHub..."
                if (Sync-WithGitHub) {
                    $lastSync = Get-Date
                    Write-Success "Sync completed at $(Get-Date -Format 'HH:mm:ss')"
                } else {
                    Write-Error "Sync failed at $(Get-Date -Format 'HH:mm:ss')"
                }
            } else {
                Write-Status "Changes detected but waiting for sync interval..."
            }
        } else {
            Write-Status "No changes detected. Monitoring..."
        }
        
        # Wait for 5 seconds before next check
        Start-Sleep -Seconds 5
        
    } catch {
        Write-Error "Error during monitoring: $($_.Exception.Message)"
        Start-Sleep -Seconds 10
    }
}
