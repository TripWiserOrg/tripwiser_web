#!/bin/bash

# TripWiser Deeplink Website Deployment Script
# This script helps deploy the website to Vercel

echo "🚀 Deploying TripWiser Deeplink Website..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your website should now be live at the URL provided above"
echo ""
echo "📋 Next steps:"
echo "1. Set up your custom domain in Vercel dashboard"
echo "2. Update the domain in all configuration files"
echo "3. Test all URL patterns"
echo "4. Configure universal links in your mobile app"

