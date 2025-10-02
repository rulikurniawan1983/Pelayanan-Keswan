#!/bin/bash
# Auto Sync with GitHub Script (Linux/Mac)
# This script will automatically sync all changes with GitHub

echo "🔄 Auto Sync with GitHub"
echo "================================="

# Function to print colored output
print_status() {
    echo -e "\033[34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo -e "\033[33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not a git repository. Please initialize git first."
    exit 1
fi

print_status "Starting GitHub sync process..."

# Check git status
print_status "Checking git status..."
git_status=$(git status --porcelain)
if [ -z "$git_status" ]; then
    print_success "No changes to commit. Repository is up to date."
    exit 0
fi

# Add all changes
print_status "Adding all changes to staging..."
git add .
if [ $? -eq 0 ]; then
    print_success "All changes added to staging"
else
    print_error "Failed to add changes to staging"
    exit 1
fi

# Create commit message with timestamp
timestamp=$(date "+%Y-%m-%d %H:%M:%S")
commit_message="Auto sync: $timestamp - Pelayanan Keswan updates"

print_status "Creating commit with message: $commit_message"
git commit -m "$commit_message"
if [ $? -eq 0 ]; then
    print_success "Commit created successfully"
else
    print_error "Failed to create commit"
    exit 1
fi

# Push to GitHub
print_status "Pushing changes to GitHub..."
git push origin main
if [ $? -eq 0 ]; then
    print_success "Changes pushed to GitHub successfully!"
else
    print_warning "Failed to push to GitHub. Trying to pull first..."
    
    # Try to pull and merge
    print_status "Pulling latest changes from GitHub..."
    git pull origin main
    if [ $? -eq 0 ]; then
        print_success "Successfully pulled latest changes"
        
        # Try to push again
        print_status "Pushing changes to GitHub again..."
        git push origin main
        if [ $? -eq 0 ]; then
            print_success "Changes pushed to GitHub successfully!"
        else
            print_error "Failed to push to GitHub after pull"
            exit 1
        fi
    else
        print_error "Failed to pull from GitHub"
        exit 1
    fi
fi

# Show final status
print_status "Checking final git status..."
git status --short

echo ""
echo "================================="
print_success "GitHub sync completed successfully!"
echo "================================="

# Show recent commits
echo ""
echo "📊 Recent commits:"
git log --oneline -5

echo ""
echo "🌐 GitHub Repository:"
echo "https://github.com/rulikurniawan1983/Pelayanan-Keswan"

echo ""
read -p "Press Enter to exit"
