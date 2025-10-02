# Watch and Sync with GitHub
# This script will watch for file changes and auto-sync with GitHub

Write-Host "👀 Watch and Sync with GitHub" -ForegroundColor Blue
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

# Watch for file changes
Write-Status "Starting file watcher..."
Write-Status "Watching for changes in current directory..."
Write-Status "Press Ctrl+C to stop watching"

# Create file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = Get-Location
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Define the action to take when a file is changed
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    Write-Status "[$timestamp] File $changeType`: $path"
    
    # Wait a bit to ensure all changes are complete
    Start-Sleep -Seconds 2
    
    # Sync with GitHub
    if (Sync-WithGitHub) {
        Write-Success "[$timestamp] Sync completed successfully!"
    } else {
        Write-Error "[$timestamp] Sync failed!"
    }
}

# Register the event
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action

Write-Status "File watcher started. Monitoring for changes..."
Write-Status "Watching: $($watcher.Path)"

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Clean up
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Get-EventSubscriber | Unregister-Event
    Write-Status "File watcher stopped."
}
