# ESG Navigator - API Backend Deployment Guide

Complete guide for deploying the ESG Navigator API backend to various platforms.

## Table of Contents

- [Overview](#overview)
- [API Architecture](#api-architecture)
- [Deployment Options](#deployment-options)
- [Docker Deployment](#docker-deployment-recommended)
- [Railway Deployment](#railway-deployment)
- [AWS Lambda Deployment](#aws-lambda-deployment)
- [Render Deployment](#render-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## Overview

The ESG Navigator API backend is an Express.js application that provides:
- **Claude AI Integration** - Chat, analysis, and report generation
- **Supplier Management** - CRUD operations for supplier data
- **AI Agents** - 9 specialized AI agents for ESG analysis
- **WebSocket Support** - Real-time updates
- **Authentication** - JWT-based auth (if implemented)

**Tech Stack:**
- Node.js 20+
- Express.js
- TypeScript
- Anthropic Claude SDK
- PostgreSQL (optional, for persistence)
- Redis (optional, for caching)

---

## API Architecture

```
┌─────────────────────────┐
│   www.esgnavigator.ai   │  (Vercel)
│   (Next.js Frontend)    │
└───────────┬─────────────┘
            │
            │ HTTPS Requests
            ↓
┌─────────────────────────┐
│  api.esgnavigator.ai    │  (Your Deployment)
│  (Express.js Backend)   │
│                         │
│  • Port 8080 (internal) │
│  • Port 443 (HTTPS)     │
└───────────┬─────────────┘
            │
            ├─→ PostgreSQL (optional)
            ├─→ Redis (optional)
            └─→ Anthropic API
```

**Current Endpoints:**
```
GET  /health                      - Health check
GET  /api/suppliers               - List suppliers
POST /api/claude/chat             - Claude AI chat
POST /api/claude/analyze-supplier - Analyze supplier ESG
POST /api/claude/generate-report  - Generate ESG report
GET  /api/agents                  - List AI agents
POST /api/agents/:agentName       - Run specific agent
```

---

## Deployment Options

| Platform | Difficulty | Cost | Best For | Auto-Scale |
|----------|-----------|------|----------|------------|
| **Docker** | Medium | Low | Full control, existing infra | Manual |
| **Railway** | Easy | Low-Med | Quick deployment, PostgreSQL included | Yes |
| **Render** | Easy | Low-Med | Simple setup, free tier | Yes |
| **AWS Lambda** | Hard | Very Low | Serverless, high scale | Yes |
| **Fly.io** | Medium | Low | Edge deployment | Yes |
| **DigitalOcean App** | Easy | Medium | Managed containers | Yes |

---

## Docker Deployment (Recommended)

Deploy the full stack (API, Database, Redis, Nginx) using Docker Compose.

### Prerequisites

- Server with Docker and Docker Compose installed
- Domain pointing to server IP
- SSL certificate (Let's Encrypt recommended)

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Clone Repository

```bash
# Clone repo
git clone https://github.com/ramabulanaT/ESG-Navigator-Pro.git
cd ESG-Navigator-Pro/esg-navigator

# Create environment file
cp .env.example .env
nano .env
```

### Step 3: Configure Environment

Edit `.env` file:

```bash
# Database
DB_PASSWORD=your-secure-db-password-here

# API Keys
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Security
JWT_SECRET=your-jwt-secret-here

# Optional
REDIS_URL=redis://redis:6379
```

### Step 4: Configure SSL Certificates

**Option A: Let's Encrypt (Automated)**

```bash
# Install certbot
sudo apt install certbot -y

# Generate certificates
sudo certbot certonly --standalone \
  -d api.esgnavigator.ai \
  -d www.esgnavigator.ai \
  --email admin@tisholdings.co.za \
  --agree-tos

# Copy to project
sudo cp /etc/letsencrypt/live/api.esgnavigator.ai/fullchain.pem \
        ./infrastructure/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/api.esgnavigator.ai/privkey.pem \
        ./infrastructure/ssl/privkey.pem

# Set permissions
sudo chmod 644 ./infrastructure/ssl/fullchain.pem
sudo chmod 600 ./infrastructure/ssl/privkey.pem
```

**Option B: Self-Signed (Development Only)**

```bash
mkdir -p infrastructure/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout infrastructure/ssl/privkey.pem \
  -out infrastructure/ssl/fullchain.pem
```

### Step 5: Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api

# Check health
curl http://localhost:8080/health
```

### Step 6: Configure Nginx (Already in docker-compose)

The `docker-compose.yml` includes nginx configured to:
- Terminate SSL on port 443
- Proxy `/api/*` to API backend
- Proxy `/` to web frontend
- Handle redirects

### Step 7: Verify Deployment

```bash
# Test locally
curl http://localhost:8080/health

# Test through nginx
curl -k https://localhost/health

# Test from external
curl https://api.esgnavigator.ai/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-25T...",
  "claude": "configured",
  "agents": 9
}
```

### Updating Deployment

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or specific service
docker-compose up -d --build api
```

---

## Railway Deployment

Railway provides easy deployment with PostgreSQL and Redis included.

### Step 1: Create Railway Account

1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify email

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `ESG-Navigator-Pro`
4. Railway auto-detects the project

### Step 3: Configure Service

1. **Set Root Directory**
   - Settings → Root Directory
   - Enter: `esg-navigator/apps/api`

2. **Configure Build**
   - Build Command: `npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - Go to Variables tab
   - Add variables (see below)

### Step 4: Add Database (Optional)

1. Click "New" → "Database" → "PostgreSQL"
2. Railway automatically creates database
3. Connection string is auto-injected as `DATABASE_URL`

### Step 5: Add Redis (Optional)

1. Click "New" → "Database" → "Redis"
2. Connection string auto-injected as `REDIS_URL`

### Environment Variables for Railway

```
NODE_ENV=production
PORT=8080
ANTHROPIC_API_KEY=sk-ant-api03-your-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://www.esgnavigator.ai
```

Railway auto-provides:
- `DATABASE_URL` (if PostgreSQL added)
- `REDIS_URL` (if Redis added)

### Step 6: Deploy

1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Railway provides a URL: `https://your-app.up.railway.app`

### Step 7: Add Custom Domain

1. Settings → Domains
2. Add: `api.esgnavigator.ai`
3. Configure DNS:
   ```
   Type    Name    Value
   CNAME   api     your-app.up.railway.app
   ```

---

## AWS Lambda Deployment

Deploy API as serverless functions using AWS SAM.

### Prerequisites

- AWS Account
- AWS CLI installed and configured
- SAM CLI installed

### Step 1: Install SAM CLI

```bash
# macOS
brew install aws-sam-cli

# Linux
pip install aws-sam-cli

# Windows
choco install aws-sam-cli
```

### Step 2: Create SAM Template

Create `template.yaml` in `esg-navigator/apps/api`:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Api:
    Cors:
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
      AllowHeaders: "'Content-Type,Authorization'"
      AllowOrigin: "'https://www.esgnavigator.ai'"

Resources:
  ESGNavigatorAPI:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Handler: dist/lambda.handler
      Runtime: nodejs20.x
      Timeout: 30
      MemorySize: 512
      Environment:
        Variables:
          ANTHROPIC_API_KEY: !Ref AnthropicApiKey
          NODE_ENV: production
      Events:
        ApiProxy:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY

Parameters:
  AnthropicApiKey:
    Type: String
    NoEcho: true
    Description: Anthropic API Key

Outputs:
  ApiEndpoint:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${ServerlessHttpApi}.execute-api.${AWS::Region}.amazonaws.com/"
```

### Step 3: Create Lambda Handler

Create `esg-navigator/apps/api/src/lambda.ts`:

```typescript
import serverless from 'serverless-http';
import app from './index'; // Your Express app

export const handler = serverless(app);
```

### Step 4: Deploy

```bash
cd esg-navigator/apps/api

# Build
npm run build

# Deploy
sam build
sam deploy --guided

# Answer prompts:
# Stack Name: esg-navigator-api
# Region: us-east-1
# Parameter AnthropicApiKey: sk-ant-...
# Confirm changes: Y
# Allow SAM CLI IAM role creation: Y
# Save arguments to config: Y
```

### Step 5: Get API URL

```bash
# Get API endpoint
aws cloudformation describe-stacks \
  --stack-name esg-navigator-api \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

### Step 6: Configure Custom Domain (Optional)

Use AWS API Gateway Custom Domains or CloudFront.

---

## Render Deployment

Render provides free tier with easy deployment.

### Step 1: Create Render Account

1. Visit [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service

1. Dashboard → "New" → "Web Service"
2. Connect repository: `ESG-Navigator-Pro`
3. Configure:
   ```
   Name:           esg-navigator-api
   Region:         Oregon (or closest to users)
   Branch:         main
   Root Directory: esg-navigator/apps/api
   Runtime:        Node
   Build Command:  npm install && npm run build
   Start Command:  npm start
   ```

### Step 3: Configure Environment

Add in "Environment" section:

```
NODE_ENV=production
PORT=8080
ANTHROPIC_API_KEY=sk-ant-api03-your-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://www.esgnavigator.ai
```

### Step 4: Add Database (Optional)

1. Dashboard → "New" → "PostgreSQL"
2. Copy connection string
3. Add to API environment: `DATABASE_URL=<connection-string>`

### Step 5: Deploy

1. Click "Create Web Service"
2. Render auto-deploys on push to main
3. URL: `https://esg-navigator-api.onrender.com`

### Step 6: Custom Domain

1. Settings → Custom Domain
2. Add: `api.esgnavigator.ai`
3. Configure DNS:
   ```
   Type    Name    Value
   CNAME   api     esg-navigator-api.onrender.com
   ```

---

## Environment Variables

### Required for All Deployments

```bash
# API Configuration
NODE_ENV=production
PORT=8080

# Anthropic Claude AI (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key-here

# Security (REQUIRED)
JWT_SECRET=your-long-random-secret-here

# Frontend (for CORS)
FRONTEND_URL=https://www.esgnavigator.ai
```

### Optional Variables

```bash
# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis (if using caching)
REDIS_URL=redis://user:pass@host:6379

# Logging
LOG_LEVEL=info
```

### Generating Secrets

```bash
# Generate JWT secret
openssl rand -hex 32

# Generate API proxy key
openssl rand -hex 32
```

---

## Post-Deployment

### Health Check

```bash
# Test health endpoint
curl https://api.esgnavigator.ai/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2025-11-25T15:30:00.000Z",
  "claude": "configured",
  "agents": 9
}
```

### Test API Endpoints

```bash
# Test suppliers endpoint
curl https://api.esgnavigator.ai/api/suppliers

# Test Claude chat (requires request body)
curl -X POST https://api.esgnavigator.ai/api/claude/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","conversationHistory":[]}'
```

### Configure Monitoring

**Set up monitoring for:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, Datadog)
- Logs aggregation (Logtail, Papertrail)

### Update Frontend Configuration

Update Vercel environment variables:

```
NEXT_PUBLIC_API_URL=https://api.esgnavigator.ai
API_BACKEND_URL=https://api.esgnavigator.ai
```

Then redeploy frontend.

---

## Troubleshooting

### API Not Responding

```bash
# Check if service is running
docker-compose ps  # Docker
railway status     # Railway

# Check logs
docker-compose logs api  # Docker
railway logs             # Railway

# Check port binding
netstat -tulpn | grep 8080
```

### CORS Errors

**Error:** `Access-Control-Allow-Origin header`

**Fix:** Update `src/index.ts` CORS configuration:

```typescript
app.use(cors({
  origin: [
    'https://www.esgnavigator.ai',
    'https://app.esgnavigator.ai',
    'http://localhost:3000'  // Development
  ],
  credentials: true
}));
```

### Anthropic API Errors

**Error:** `Invalid API key`

**Fix:**
1. Verify `ANTHROPIC_API_KEY` is set correctly
2. Check key format: `sk-ant-api03-...`
3. Verify key hasn't expired
4. Test key directly: `curl https://api.anthropic.com/v1/messages`

### Database Connection Issues

**Error:** `Unable to connect to database`

**Fix:**
1. Check `DATABASE_URL` format
2. Verify database is running
3. Check network access/firewall
4. Test connection: `psql $DATABASE_URL`

---

## Security Best Practices

- ✅ Use HTTPS only (enforce in nginx/load balancer)
- ✅ Set strong `JWT_SECRET`
- ✅ Rotate API keys regularly
- ✅ Enable rate limiting
- ✅ Use environment variables (never hardcode secrets)
- ✅ Keep dependencies updated
- ✅ Enable CORS only for known origins
- ✅ Use security headers (helmet.js)
- ✅ Monitor for suspicious activity

---

## Resources

- **Anthropic API Docs**: https://docs.anthropic.com
- **Express.js Guide**: https://expressjs.com/en/guide
- **Docker Docs**: https://docs.docker.com
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs

---

**Last Updated**: 2025-11-25
**Version**: 1.0.0
