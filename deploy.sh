#!/bin/bash

# Deploy Pelayanan Keswan to Vercel
# This script will update GitHub and deploy to Vercel

echo "🚀 Starting deployment process..."
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_status "Initializing git repository..."
    git init
    if [ $? -eq 0 ]; then
        print_success "Git repository initialized"
    else
        print_error "Failed to initialize git repository"
        exit 1
    fi
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_warning "No remote origin found"
    read -p "Enter your GitHub repository URL: " repo_url
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        print_success "Remote origin added: $repo_url"
    else
        print_error "No repository URL provided"
        exit 1
    fi
fi

# Add all files
print_status "Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    # Commit changes
    print_status "Committing changes..."
    git commit -m "Update: Ready for deployment to Vercel"
    if [ $? -eq 0 ]; then
        print_success "Changes committed successfully"
    else
        print_error "Failed to commit changes"
        exit 1
    fi
fi

# Push to GitHub
print_status "Pushing to GitHub..."
git push origin main
if [ $? -eq 0 ]; then
    print_success "Successfully pushed to GitHub"
else
    print_error "Failed to push to GitHub"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -eq 0 ]; then
        print_success "Vercel CLI installed successfully"
    else
        print_error "Failed to install Vercel CLI"
        exit 1
    fi
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please login..."
    vercel login
    if [ $? -eq 0 ]; then
        print_success "Successfully logged in to Vercel"
    else
        print_error "Failed to login to Vercel"
        exit 1
    fi
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod
if [ $? -eq 0 ]; then
    print_success "Successfully deployed to Vercel!"
    echo ""
    echo "🌐 Your application is now live!"
    echo "📱 Access your app at the URL provided above"
    echo "🔧 Check deployment status: vercel ls"
    echo "📊 View logs: vercel logs"
else
    print_error "Failed to deploy to Vercel"
    exit 1
fi

echo ""
echo "====================================="
print_success "Deployment process completed!"
echo "====================================="
