# ESG Navigator - Vercel Deployment Guide

Complete guide for deploying the ESG Navigator web application to Vercel.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Deployment Methods](#deployment-methods)
- [Environment Variables](#environment-variables)
- [Domain Configuration](#domain-configuration)
- [API Backend Options](#api-backend-options)
- [Troubleshooting](#troubleshooting)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

### Required Accounts
- ✅ **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
- ✅ **GitHub Account** - Repository access
- ✅ **Domain Access** - DNS configuration for `esgnavigator.ai`

### Required Services
- ✅ **API Backend** - Must be deployed separately (options below)
- ✅ **Database** - PostgreSQL (if API requires it)
- ⚠️ **Optional**: Anthropic API key for AI features

---

## Project Structure

The ESG Navigator repository is organized as follows:

```
ESG-Navigator-Pro/
├── esg-navigator/               # Main project (this gets deployed)
│   ├── apps/
│   │   ├── web/                # Next.js frontend → Deploy to Vercel
│   │   └── api/                # Express.js backend → Deploy separately
│   ├── infrastructure/
│   │   ├── nginx.conf         # Nginx config (for Docker deployment)
│   │   └── ssl/               # SSL certificates
│   └── docker-compose.yml     # Docker deployment (alternative to Vercel)
├── vercel.json                # Root Vercel config
└── middleware.ts              # Edge middleware for redirects
```

**Important**: When deploying to Vercel, you'll deploy the **frontend** (`apps/web`) only. The API backend must be deployed separately.

---

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

This is the easiest method with automatic deployments on every push.

#### Step 1: Connect Repository to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"

2. **Import Git Repository**
   - Select "Import Git Repository"
   - Choose your GitHub account/organization
   - Select `ESG-Navigator-Pro` repository
   - Click "Import"

3. **Configure Project**
   ```
   Project Name:        esg-navigator-web
   Framework Preset:    Next.js
   Root Directory:      esg-navigator/apps/web
   Build Command:       npm run build
   Output Directory:    .next
   Install Command:     npm install
   Development Command: npm run dev
   ```

4. **Set Environment Variables** (see section below)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Your app will be available at `https://esg-navigator-web.vercel.app`

#### Step 2: Configure Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to feature branches or PRs

**To customize branches:**
1. Go to Project Settings → Git
2. Configure Production Branch (default: `main`)
3. Enable/disable Preview Deployments

---

### Method 2: Vercel CLI

Use this method for manual deployments or CI/CD pipelines.

#### Install Vercel CLI

```bash
npm install -g vercel
```

#### Login to Vercel

```bash
vercel login
```

#### Deploy

```bash
# Navigate to web app directory
cd esg-navigator/apps/web

# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# With specific environment
vercel --prod --env NEXT_PUBLIC_API_URL=https://api.esgnavigator.ai
```

---

### Method 3: GitHub Actions (CI/CD)

Automate deployments with GitHub Actions.

**Create `.github/workflows/deploy-vercel.yml`:**

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./esg-navigator/apps/web

      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./esg-navigator/apps/web

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: ./esg-navigator/apps/web
```

**Setup:**
1. Generate Vercel token: Settings → Tokens
2. Add to GitHub Secrets: `VERCEL_TOKEN`

---

## Environment Variables

### Required Variables

Configure in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Value (Production) | Environment | Description |
|----------|-------------------|-------------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://www.esgnavigator.ai` or `https://api.esgnavigator.ai` | All | Public API endpoint |
| `API_BACKEND_URL` | `https://api.esgnavigator.ai` | All | Server-side API URL |
| `NEXT_PUBLIC_WS_URL` | `wss://www.esgnavigator.ai/realtime` | All | WebSocket endpoint |
| `NEXT_PUBLIC_ENV` | `production` | Production | Environment name |

### Optional Variables

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `API_PROXY_KEY` | `your-secret-key` | Proxy authentication key |
| `SENDGRID_API_KEY` | `SG.xxx` | Email sending (if used) |
| `FROM_ADDRESS` | `noreply@esgnavigator.ai` | Email from address |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics ID |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://xxx@sentry.io/xxx` | Error tracking |

### Setting Environment Variables

**Via Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Click "Add" for each variable
3. Enter Key and Value
4. Select environments:
   - ✅ **Production** - for main branch
   - ✅ **Preview** - for PR previews
   - ⬜ **Development** - use `.env.local` instead

**Via Vercel CLI:**

```bash
# Set a variable
vercel env add NEXT_PUBLIC_API_URL production

# List all variables
vercel env ls

# Remove a variable
vercel env rm NEXT_PUBLIC_API_URL production
```

**Environment Scopes:**
- **Production**: Used for `vercel --prod` or main branch deployments
- **Preview**: Used for preview deployments (PRs, feature branches)
- **Development**: For local development only (use `.env.local`)

---

## Domain Configuration

### Step 1: Add Custom Domain to Vercel

1. **Navigate to Domains**
   - Go to Project Settings → Domains

2. **Add Domain**
   - Enter: `www.esgnavigator.ai`
   - Click "Add"

3. **Verify Ownership**
   - Vercel will provide DNS records to add
   - See DNS configuration below

### Step 2: Configure DNS Records

**In your DNS provider (Cloudflare, Route53, etc.):**

#### Option A: Using Vercel DNS (Recommended)

```
Type    Name    Value                           TTL
----    ----    -----                           ---
CNAME   www     cname.vercel-dns.com            Auto
```

#### Option B: Using A Records

```
Type    Name    Value                           TTL
----    ----    -----                           ---
A       www     76.76.21.21                     3600
```

**Vercel IP Addresses:**
- `76.76.21.21` (Primary)
- `76.76.21.22` (Secondary)

**Note**: Use CNAME for better reliability and automatic IP updates.

### Step 3: Configure Apex Domain Redirect

Since `esgnavigator.ai` (apex) should redirect to `www.esgnavigator.ai`:

**Option 1: Cloudflare (Recommended)**
- Set up a Page Rule redirect or use Cloudflare's CNAME flattening

**Option 2: DNS Provider with ALIAS/ANAME**
- Point apex to `cname.vercel-dns.com`

**Option 3: Middleware Redirect**
- The deployed `middleware.ts` handles this redirect

### Step 4: Configure SSL

Vercel automatically provisions SSL certificates via Let's Encrypt.

**To verify:**
1. Go to Project Settings → Domains
2. Check SSL status (should show "Active")
3. Wait 5-10 minutes for certificate issuance

**If SSL fails:**
- Ensure DNS is properly configured
- Check CAA records don't block Let's Encrypt
- Contact Vercel support

---

## API Backend Options

The frontend requires an API backend. Choose one option:

### Option 1: Docker Deployment (Self-Hosted)

Deploy the full stack using Docker on your own server.

**Pros:**
- Full control
- All services in one place
- Cost-effective for high traffic

**Cons:**
- Requires server management
- Manual scaling

**Setup:**
```bash
# On your server
cd esg-navigator
docker-compose up -d

# Configure nginx to expose API at api.esgnavigator.ai
# See DNS-CONFIGURATION.md for details
```

**Environment Variables for Web App:**
```
NEXT_PUBLIC_API_URL=https://api.esgnavigator.ai
API_BACKEND_URL=https://api.esgnavigator.ai
```

---

### Option 2: AWS Lambda (Serverless)

Deploy API as serverless functions.

**Pros:**
- Auto-scaling
- Pay per request
- No server management

**Cons:**
- Cold start latency
- Complexity in setup

**Setup:**
1. Package API for Lambda
2. Deploy via AWS SAM or Serverless Framework
3. Configure API Gateway
4. Get endpoint URL

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
API_BACKEND_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
```

**Reference:** See `/esg-navigator/apps/web/.env.local` for existing Lambda URL

---

### Option 3: Railway/Render/Fly.io

Deploy API to a PaaS provider.

**Railway Example:**
1. Connect GitHub repo
2. Select `esg-navigator/apps/api`
3. Set environment variables
4. Deploy

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
API_BACKEND_URL=https://your-api.up.railway.app
```

---

### Option 4: Vercel Serverless Functions (Hybrid)

Convert Express API to Vercel serverless functions.

**⚠️ Limitations:**
- 10-second execution limit
- No WebSocket support
- Limited for complex operations

**Use only for simple APIs or proxying.**

---

## Troubleshooting

### Build Failures

**Error: Module not found**
```
Solution:
1. Check package.json dependencies
2. Verify import paths use @/ alias correctly
3. Ensure all files exist in repository
```

**Error: TypeScript errors**
```
Solution:
1. Check tsconfig.json is correct
2. Review type errors in build log
3. Temporarily set ignoreBuildErrors: true in next.config.js (not recommended for production)
```

### API Connection Issues

**Error: Failed to fetch from API**
```
Cause: CORS or wrong API URL

Solution:
1. Check NEXT_PUBLIC_API_URL is correct
2. Verify API backend is running
3. Test API directly: curl https://api.esgnavigator.ai/health
4. Check CORS headers in API
5. Review Network tab in browser DevTools
```

**Error: API returns 404**
```
Cause: API not deployed or wrong endpoint

Solution:
1. Verify API backend is deployed
2. Check API base URL doesn't have trailing slash
3. Ensure API routes are registered correctly
```

### Redirect Issues

**Apex domain not redirecting**
```
Cause: DNS not configured or middleware not deployed

Solution:
1. Check DNS records for apex domain
2. Verify middleware.ts is deployed
3. Clear browser cache
4. Test in incognito mode
```

### SSL Certificate Issues

**SSL certificate invalid**
```
Cause: DNS not propagated or Vercel can't verify domain

Solution:
1. Wait for DNS propagation (up to 48 hours)
2. Check DNS is pointing to Vercel
3. Verify CAA records allow Let's Encrypt
4. Contact Vercel support
```

### Performance Issues

**Slow page loads**
```
Cause: API latency or large bundle size

Solution:
1. Check API response times
2. Analyze bundle size: npm run build
3. Use Next.js Image optimization
4. Enable caching headers
5. Consider using CDN
```

### Environment Variable Not Working

**Variable is undefined**
```
Cause: Wrong prefix or not set in Vercel

Solution:
1. Browser variables MUST start with NEXT_PUBLIC_
2. Set in Vercel Dashboard → Environment Variables
3. Redeploy after adding variables
4. Check variable is selected for correct environment
```

---

## Post-Deployment Checklist

### Immediately After Deployment

- [ ] Site loads at `https://esg-navigator-web.vercel.app`
- [ ] Custom domain works: `https://www.esgnavigator.ai`
- [ ] Apex redirect works: `https://esgnavigator.ai` → `https://www.esgnavigator.ai`
- [ ] SSL certificate is active (🔒 icon in browser)
- [ ] No console errors in browser DevTools
- [ ] API health check works: Test `/api/health` or API endpoint

### Functionality Testing

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Dashboard loads (if logged in)
- [ ] API requests succeed
- [ ] WebSocket connections work (if applicable)
- [ ] Forms submit successfully
- [ ] Images load correctly
- [ ] Mobile responsive design works

### Performance & SEO

- [ ] Run Lighthouse audit (score > 90)
- [ ] Check Core Web Vitals
- [ ] Verify meta tags are correct
- [ ] Test Open Graph preview
- [ ] Check robots.txt allows indexing (production only)
- [ ] Sitemap is accessible

### Security

- [ ] HTTPS enforced (no mixed content)
- [ ] HSTS header present
- [ ] Security headers configured (X-Frame-Options, etc.)
- [ ] No sensitive data in client-side code
- [ ] API keys are environment variables (not hardcoded)
- [ ] CORS configured correctly

### Monitoring Setup

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure analytics (Google Analytics, Plausible)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure alerts for deployment failures

---

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Open project in Vercel Dashboard
vercel open

# Check build output locally
npm run build

# Start production build locally
npm run start

# Analyze bundle size
npm run build
# Then check .next/analyze/

# Test production build locally
npm run build && npm run start
# Visit http://localhost:3000
```

---

## Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Custom Domains**: https://vercel.com/docs/concepts/projects/domains
- **Vercel CLI**: https://vercel.com/docs/cli

---

## Support

**Vercel Issues:**
- Community: https://github.com/vercel/vercel/discussions
- Support: support@vercel.com

**Project Issues:**
- Technical Lead: admin@tisholdings.co.za
- Support: support@tisholdings.co.za

---

**Last Updated**: 2025-11-25
**Version**: 1.0.0
