#!/bin/bash

# ESG Navigator API Deployment Script
# Supports multiple deployment platforms

set -e

echo "🚀 ESG Navigator API - Deployment Script"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found${NC}"
    echo "Creating .env from .env.example..."
    if [ -f ../.env.example ]; then
        cp ../.env.example .env
        echo -e "${GREEN}✓${NC} .env file created. Please update with your actual values."
    else
        echo -e "${RED}✗${NC} .env.example not found. Please create .env file manually."
        exit 1
    fi
fi

# Build the TypeScript code
echo ""
echo "📦 Building TypeScript code..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build successful!"
else
    echo -e "${RED}✗${NC} Build failed!"
    exit 1
fi

# Ask user which platform to deploy to
echo ""
echo "Select deployment platform:"
echo "1) Vercel"
echo "2) Railway"
echo "3) Render"
echo "4) Local/Docker"
echo "5) Test locally (development mode)"
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo ""
        echo "🔷 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo -e "${RED}✗${NC} Vercel CLI not installed. Install with: npm i -g vercel"
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "🚂 Deploying to Railway..."
        if command -v railway &> /dev/null; then
            railway up
        else
            echo -e "${RED}✗${NC} Railway CLI not installed. Install with: npm i -g @railway/cli"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "🎨 Deploying to Render..."
        echo "Please visit https://dashboard.render.com and:"
        echo "1. Create a new Web Service"
        echo "2. Connect your repository"
        echo "3. Use render.yaml configuration"
        ;;
    4)
        echo ""
        echo "🐳 Starting with Docker..."
        if command -v docker &> /dev/null; then
            docker build -t esg-navigator-api .
            docker run -p 8080:8080 --env-file .env esg-navigator-api
        else
            echo -e "${RED}✗${NC} Docker not installed."
            exit 1
        fi
        ;;
    5)
        echo ""
        echo "🧪 Starting local development server..."
        npm start
        ;;
    *)
        echo -e "${RED}✗${NC} Invalid choice"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 API Endpoints:"
echo "   - GET  /health"
echo "   - POST /api/auth/login"
echo "   - GET  /api/suppliers"
echo "   - POST /api/claude/chat"
echo ""
echo "🔑 Demo credentials: admin@tisholdings.co.za / admin123"
