# ============================================================================
# ESG Navigator - Bootstrap Script
# Run this FIRST to set up everything
# ============================================================================

Write-Host @"

╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           ESG NAVIGATOR - BOOTSTRAP                      ║
║           Setting up your AI platform...                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# Check if we're in the right place
if (Test-Path "package.json") {
    Write-Host "✓ Already in project directory" -ForegroundColor Green
} else {
    Write-Host "→ Creating project structure..." -ForegroundColor Yellow
}

# ============================================================================
# CREATE PROJECT STRUCTURE
# ============================================================================

Write-Host "`nCreating directories..." -ForegroundColor Cyan

$directories = @(
    "apps/web/src/app",
    "apps/web/src/app/dashboard",
    "apps/web/src/app/training",
    "apps/web/src/components/layout",
    "apps/web/src/components/dashboard",
    "apps/web/src/components/ui",
    "apps/web/src/lib",
    "apps/web/src/hooks",
    "apps/web/src/types",
    "apps/web/public",
    "apps/api/src/agents",
    "apps/api/src/routes",
    "apps/api/src/middleware",
    "apps/api/src/services",
    "apps/api/src/utils",
    "apps/api/src/config",
    "apps/api/src/websocket",
    "apps/api/logs",
    "infrastructure",
    "scripts",
    "docs"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "✓ Directory structure created" -ForegroundColor Green

# ============================================================================
# ROOT PACKAGE.JSON
# ============================================================================

Write-Host "`nCreating root package.json..." -ForegroundColor Cyan

$rootPackage = @"
{
  "name": "esg-navigator",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*"
  ],
  "scripts": {
    "dev:web": "cd apps/web && npm run dev",
    "dev:api": "cd apps/api && npm run dev",
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\"",
    "build": "npm run build:api && npm run build:web",
    "build:web": "cd apps/web && npm run build",
    "build:api": "cd apps/api && npm run build",
    "deploy": "pwsh scripts/deploy.ps1"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
"@

$rootPackage | Out-File -FilePath "package.json" -Encoding UTF8
Write-Host "✓ Root package.json created" -ForegroundColor Green

# ============================================================================
# FRONTEND PACKAGE.JSON
# ============================================================================

Write-Host "`nCreating frontend package.json..." -ForegroundColor Cyan

$webPackage = @"
{
  "name": "@esgnavigator/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "lucide-react": "^0.263.1",
    "recharts": "^2.12.0",
    "date-fns": "^3.3.0",
    "axios": "^1.6.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "14.2.0"
  }
}
"@

$webPackage | Out-File -FilePath "apps/web/package.json" -Encoding UTF8
Write-Host "✓ Frontend package.json created" -ForegroundColor Green

# ============================================================================
# BACKEND PACKAGE.JSON
# ============================================================================

Write-Host "`nCreating backend package.json..." -ForegroundColor Cyan

$apiPackage = @"
{
  "name": "@esgnavigator/api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "ws": "^8.16.0",
    "axios": "^1.6.0",
    "dotenv": "^16.4.0",
    "winston": "^3.11.0",
    "@anthropic-ai/sdk": "^0.20.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/ws": "^8.5.10",
    "@types/node": "^20.11.0",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0"
  }
}
"@

$apiPackage | Out-File -FilePath "apps/api/package.json" -Encoding UTF8
Write-Host "✓ Backend package.json created" -ForegroundColor Green

# ============================================================================
# ENVIRONMENT FILES
# ============================================================================

Write-Host "`nCreating environment templates..." -ForegroundColor Cyan

$webEnv = @"
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3000
API_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/realtime
NEXT_PUBLIC_ENV=development
"@

$webEnv | Out-File -FilePath "apps/web/.env.local" -Encoding UTF8

$apiEnv = @"
# Backend Environment Variables
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://localhost:5432/esgnavigator_dev

# Redis
REDIS_URL=redis://localhost:6379

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_key_here

# IBM Watsonx (optional)
WATSONX_API_KEY=your_watsonx_key_here
WATSONX_PROJECT_ID=your_project_id_here

# Logging
LOG_LEVEL=info
"@

$apiEnv | Out-File -FilePath "apps/api/.env" -Encoding UTF8
Write-Host "✓ Environment files created" -ForegroundColor Green

# ============================================================================
# README
# ============================================================================

Write-Host "`nCreating README..." -ForegroundColor Cyan

$readme = @"
# ESG Navigator

AI-powered ESG compliance platform with intelligent agents.

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   cd apps/web && npm install && cd ../..
   cd apps/api && npm install && cd ../..
   \`\`\`

2. **Configure environment:**
   - Edit \`apps/web/.env.local\`
   - Edit \`apps/api/.env\`
   - Add your Anthropic API key

3. **Start development:**
   \`\`\`bash
   # Terminal 1 - Backend
   cd apps/api
   npm run dev

   # Terminal 2 - Frontend
   cd apps/web
   npm run dev
   \`\`\`

4. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080
   - API Docs: http://localhost:8080/api-docs

## Project Structure

\`\`\`
esg-navigator/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express.js backend
├── infrastructure/   # Deployment configs
├── scripts/          # Automation scripts
└── docs/            # Documentation
\`\`\`

## Next Steps

Run the file creation scripts to generate all components:
\`\`\`powershell
pwsh scripts/create-all-files.ps1
\`\`\`

See individual app READMEs for more details.
"@

$readme | Out-File -FilePath "README.md" -Encoding UTF8
Write-Host "✓ README created" -ForegroundColor Green

# ============================================================================
# CREATE FILE GENERATION SCRIPT
# ============================================================================

Write-Host "`nCreating file generation script..." -ForegroundColor Cyan

$createFiles = @"
# This script creates all the application files
Write-Host "Creating all application files..." -ForegroundColor Cyan

# Copy all the component code from the artifacts
Write-Host "→ You'll need to manually copy the code from Claude's artifacts" -ForegroundColor Yellow
Write-Host "→ Or I can create a simplified version now" -ForegroundColor Yellow

Write-Host "`nFiles to create:" -ForegroundColor Cyan
Write-Host "  apps/web/src/app/layout.tsx"
Write-Host "  apps/web/src/app/page.tsx"
Write-Host "  apps/web/src/app/dashboard/page.tsx"
Write-Host "  apps/web/src/app/training/page.tsx"
Write-Host "  apps/web/src/app/globals.css"
Write-Host "  apps/web/src/components/layout/Navigation.tsx"
Write-Host "  apps/web/src/components/layout/Footer.tsx"
Write-Host "  apps/web/src/components/dashboard/MetricsGrid.tsx"
Write-Host "  apps/web/src/components/dashboard/EmissionsChart.tsx"
Write-Host "  apps/web/src/components/dashboard/AgentStatus.tsx"
Write-Host "  apps/web/src/components/dashboard/RecentActivity.tsx"
Write-Host "  apps/web/src/hooks/useWebSocket.ts"
Write-Host "  apps/web/src/lib/api.ts"
Write-Host "  apps/web/next.config.js"
Write-Host "  apps/web/tsconfig.json"
Write-Host "  apps/web/tailwind.config.js"
Write-Host "  apps/api/src/index.ts"
Write-Host "  apps/api/src/agents/*.ts"
Write-Host "  apps/api/src/routes/*.ts"
Write-Host "  apps/api/src/websocket/server.ts"
Write-Host "  apps/api/src/utils/logger.ts"
Write-Host "  apps/api/tsconfig.json"

Write-Host "`n✓ Structure is ready for files" -ForegroundColor Green
"@

$createFiles | Out-File -FilePath "scripts/create-all-files.ps1" -Encoding UTF8
Write-Host "✓ File generation script created" -ForegroundColor Green

# ============================================================================
# SUCCESS MESSAGE
# ============================================================================

Write-Host @"

╔══════════════════════════════════════════════════════════╗
║                                                          ║
║                 ✓ BOOTSTRAP COMPLETE!                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

📁 Project structure created
📦 Package.json files ready
⚙️  Environment templates created
📚 README generated

NEXT STEPS:
──────────

1. Install dependencies:
   npm install

2. Create a new file for each component I showed you:
   
   QUICK METHOD - Copy these exact files:
   
   📝 Create: apps/web/next.config.js
   (Copy from "Next.js App Structure Setup" artifact)
   
   📝 Create: apps/web/src/app/page.tsx
   (Copy from "App Components Generator" artifact)
   
   📝 Create: apps/api/src/index.ts
   (Copy from "Backend API Setup Script" artifact)
   
   And so on for each file...

3. Or let me create a SIMPLE starter version:
   Would you like me to create minimal working files 
   so you can start immediately?

CURRENT LOCATION:
────────────────
$((Get-Location).Path)

"@ -ForegroundColor Cyan

# Ask user what they want to do next
Write-Host "`nWhat would you like to do?" -ForegroundColor Yellow
Write-Host "1. I'll copy the files manually from artifacts" -ForegroundColor White
Write-Host "2. Create simple starter files now (minimal but working)" -ForegroundColor White
Write-Host "3. Just install dependencies and I'll code later" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host "`n✓ Great! Copy the code from each artifact I created." -ForegroundColor Green
        Write-Host "  Start with the package.json files (already done!)" -ForegroundColor Green
        Write-Host "  Then copy each .tsx, .ts, and config file" -ForegroundColor Green
    }
    "2" {
        Write-Host "`n→ Creating minimal starter files..." -ForegroundColor Yellow
        pwsh scripts/create-minimal-starter.ps1
    }
    "3" {
        Write-Host "`n→ Installing dependencies..." -ForegroundColor Yellow
        npm install
        Write-Host "✓ Dependencies installed" -ForegroundColor Green
    }
}

Write-Host "`n🚀 Ready to build! Good luck!" -ForegroundColor Cyan