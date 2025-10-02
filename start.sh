#!/bin/bash

echo "Starting Pelayanan Keswan Application..."
echo ""
echo "Opening application in browser..."
echo ""
echo "If the browser doesn't open automatically, please open:"
echo "http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if live-server is installed
if ! npx live-server --version &> /dev/null; then
    echo "Installing live-server..."
    npm install -g live-server
fi

# Start the live server
npx live-server --port=3000 --open=/index.html --no-browser
