#!/bin/bash

# Simple Deploy Script for Vercel
# This script will deploy the static site to Vercel

echo "🚀 Simple Deploy to Vercel"
echo "=========================="

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

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    print_error "index.html not found. Please run this script from the project root directory."
    exit 1
fi

print_success "Project files found"

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
vercel --prod --yes
if [ $? -eq 0 ]; then
    print_success "Successfully deployed to Vercel!"
    echo ""
    echo "🌐 Your application is now live!"
    echo "📱 Check your Vercel dashboard for the URL"
    echo "🔧 Run 'vercel ls' to see all deployments"
else
    print_error "Failed to deploy to Vercel"
    exit 1
fi

echo ""
echo "=========================="
print_success "Deployment completed!"
echo "=========================="
