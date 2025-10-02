# Continuous Auto Sync with GitHub
# This script will continuously monitor and sync changes with GitHub

Write-Host "🔄 Continuous Auto Sync with GitHub" -ForegroundColor Blue
Write-Host "=====================================" -ForegroundColor Blue

# Function to sync with GitHub
function Sync-WithGitHub {
    # Check git status
    $gitStatus = git status --porcelain
    if (-not $gitStatus) {
        return $true
    }
    
    # Add all changes
    git add .
    if ($LASTEXITCODE -ne 0) {
        return $false
    }
    
    # Create commit message with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "Auto sync: $timestamp - Pelayanan Keswan updates"
    
    # Commit changes
    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) {
        return $false
    }
    
    # Push to GitHub
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        # Try to pull and merge
        git pull origin main
        if ($LASTEXITCODE -eq 0) {
            git push origin main
        } else {
            return $false
        }
    }
    
    return $true
}

# Initial sync
Write-Host "[INFO] Performing initial sync..." -ForegroundColor Blue
if (Sync-WithGitHub) {
    Write-Host "[SUCCESS] Initial sync completed!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Initial sync failed!" -ForegroundColor Red
    exit 1
}

# Continuous monitoring
Write-Host "[INFO] Starting continuous monitoring..." -ForegroundColor Blue
Write-Host "[INFO] Press Ctrl+C to stop monitoring" -ForegroundColor Yellow

$lastSync = Get-Date
$syncInterval = 30 # seconds

while ($true) {
    try {
        # Check if there are any changes
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            $timeSinceLastSync = (Get-Date) - $lastSync
            if ($timeSinceLastSync.TotalSeconds -ge $syncInterval) {
                Write-Host "[INFO] Changes detected. Syncing with GitHub..." -ForegroundColor Blue
                if (Sync-WithGitHub) {
                    $lastSync = Get-Date
                    Write-Host "[SUCCESS] Sync completed at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
                } else {
                    Write-Host "[ERROR] Sync failed at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Red
                }
            } else {
                Write-Host "[INFO] Changes detected but waiting for sync interval..." -ForegroundColor Yellow
            }
        } else {
            Write-Host "[INFO] No changes detected. Monitoring..." -ForegroundColor Blue
        }
        
        # Wait for 5 seconds before next check
        Start-Sleep -Seconds 5
        
    } catch {
        Write-Host "[ERROR] Error during monitoring: $($_.Exception.Message)" -ForegroundColor Red
        Start-Sleep -Seconds 10
    }
}
