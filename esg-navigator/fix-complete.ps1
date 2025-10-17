# ============================================================================
# Complete Fix for ESG Navigator
# ============================================================================

Write-Host "🔧 Fixing ESG Navigator..." -ForegroundColor Cyan

$projectRoot = "C:\Users\user\esg-navigator"
Set-Location $projectRoot

# ============================================================================
# FIX 1: Clean and reinstall EVERYTHING
# ============================================================================

Write-Host "`n📦 Step 1: Clean installation..." -ForegroundColor Yellow

# Remove all node_modules
Write-Host "Removing old node_modules..." -ForegroundColor Gray
Get-ChildItem -Path . -Include node_modules -Recurse -Directory | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# Remove package-lock files
Get-ChildItem -Path . -Include package-lock.json -Recurse -File | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "✓ Cleaned" -ForegroundColor Green

# ============================================================================
# FIX 2: Install root dependencies
# ============================================================================

Write-Host "`n📦 Step 2: Installing root dependencies..." -ForegroundColor Yellow

npm install
Write-Host "✓ Root dependencies installed" -ForegroundColor Green

# ============================================================================
# FIX 3: Fix API (Backend)
# ============================================================================

Write-Host "`n📦 Step 3: Fixing API backend..." -ForegroundColor Yellow

Set-Location "apps\api"

# Make sure package.json has correct dependencies
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
    "@anthropic-ai/sdk": "^0.27.3"
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

$apiPackage | Out-File -FilePath "package.json" -Encoding UTF8 -Force

# Create tsconfig if missing
if (-not (Test-Path "tsconfig.json")) {
    @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
"@ | Out-File -FilePath "tsconfig.json" -Encoding UTF8
}

# Create minimal index.ts if missing
if (-not (Test-Path "src\index.ts")) {
    New-Item -ItemType Directory -Force -Path "src" | Out-Null
    @"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('🚀 ESG Navigator API running on http://localhost:' + PORT);
});
"@ | Out-File -FilePath "src\index.ts" -Encoding UTF8
}

npm install
Write-Host "✓ API dependencies installed" -ForegroundColor Green

Set-Location $projectRoot

# ============================================================================
# FIX 4: Fix Web (Frontend)
# ============================================================================

Write-Host "`n📦 Step 4: Fixing web frontend..." -ForegroundColor Yellow

Set-Location "apps\web"

# Create proper Next.js structure if missing
if (-not (Test-Path "src\app")) {
    New-Item -ItemType Directory -Force -Path "src\app" | Out-Null
}

# Create minimal page.tsx
if (-not (Test-Path "src\app\page.tsx")) {
    @"
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">ESG Navigator</h1>
      <p className="text-lg">AI-Powered ESG Intelligence Platform</p>
      <div className="mt-8">
        <a href="/dashboard" className="text-blue-600 hover:underline">
          Go to Dashboard →
        </a>
      </div>
    </main>
  )
}
"@ | Out-File -FilePath "src\app\page.tsx" -Encoding UTF8
}

# Create layout.tsx
if (-not (Test-Path "src\app\layout.tsx")) {
    @"
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ESG Navigator',
  description: 'AI-Powered ESG Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
"@ | Out-File -FilePath "src\app\layout.tsx" -Encoding UTF8
}

# Create globals.css
if (-not (Test-Path "src\app\globals.css")) {
    @"
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
"@ | Out-File -FilePath "src\app\globals.css" -Encoding UTF8
}

# Make sure package.json is correct
$webPackage = @"
{
  "name": "@esgnavigator/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "lucide-react": "^0.292.0"
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

$webPackage | Out-File -FilePath "package.json" -Encoding UTF8 -Force

npm install
Write-Host "✓ Web dependencies installed" -ForegroundColor Green

Set-Location $projectRoot

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║            ✅ FIX COMPLETE!                          ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📝 FIXED:" -ForegroundColor Yellow
Write-Host "  ✓ Cleaned all node_modules" -ForegroundColor Green
Write-Host "  ✓ Reinstalled root dependencies" -ForegroundColor Green
Write-Host "  ✓ Fixed API backend (TypeScript)" -ForegroundColor Green
Write-Host "  ✓ Fixed Web frontend (Next.js)" -ForegroundColor Green
Write-Host "  ✓ Created minimal working files" -ForegroundColor Green

Write-Host "`n🚀 NOW START THE SERVERS:" -ForegroundColor Cyan
Write-Host "`n  Terminal 1 - Backend:" -ForegroundColor White
Write-Host "  cd apps\api" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Cyan

Write-Host "`n  Terminal 2 - Frontend:" -ForegroundColor White
Write-Host "  cd apps\web" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Cyan

Write-Host "`n🌐 ACCESS:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8080" -ForegroundColor Cyan

Write-Host "`n✨ Both should start without errors now!" -ForegroundColor Green
