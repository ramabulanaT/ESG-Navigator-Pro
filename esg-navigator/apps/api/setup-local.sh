#!/bin/bash

# Local Testing & Deployment Guide for Agent System v2
# ESG Navigator - TIS Holdings

echo "🚀 ESG Navigator Agent System v2 - Local Setup"
echo "=============================================="
echo ""

# Step 1: Environment Setup
echo "📋 Step 1: Setting up environment..."
cd /home/user/ESG-Navigator-Pro/esg-navigator/apps/api

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
# ESG Navigator API Configuration

# Server
NODE_ENV=development
PORT=5050

# Frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Anthropic Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_MAX_TOKENS=4096

# Logging
LOG_LEVEL=info

# API
API_VERSION=v2
EOF
    echo "✅ Created .env file - IMPORTANT: Add your ANTHROPIC_API_KEY!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "⚠️  CRITICAL: Update .env with your ANTHROPIC_API_KEY"
echo "   Get your key from: https://console.anthropic.com/settings/keys"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎯 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your ANTHROPIC_API_KEY"
echo "2. Run: npm run dev"
echo "3. Test agents at: http://localhost:5050/api/agents/v2"
echo ""
echo "Demo credentials:"
echo "  Email: admin@tisholdings.co.za"
echo "  Password: admin123"
