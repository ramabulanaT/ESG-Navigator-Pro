# ESG Navigator - Current Deployment Architecture

## Overview

ESG Navigator uses a **hybrid deployment strategy**:
- **Production**: AWS Lambda + S3 + Vercel
- **Local Development**: Docker Compose

This document outlines the current architecture and how components work together.

---

## Production Architecture (AWS + Vercel)

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION ENVIRONMENT                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│   Users (Internet)      │
└───────────┬─────────────┘
            │
            ├──────────────────────────────────────┐
            │                                      │
            ↓                                      ↓
┌─────────────────────────┐         ┌─────────────────────────┐
│   www.esgnavigator.ai   │         │  app.esgnavigator.ai    │
│   (Vercel CDN)          │         │  (Redirect → /dashboard)│
│                         │         └─────────────────────────┘
│  • Next.js Frontend     │
│  • Static Assets (S3)   │
│  • Edge Functions       │
│  • Middleware           │
└───────────┬─────────────┘
            │
            │ API Calls
            ↓
┌───────────────────────────────────────────────────────────────┐
│  AWS Lambda (API Gateway)                                      │
│  https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod │
│                                                                │
│  • Express.js API (Serverless)                                │
│  • Anthropic Claude Integration                               │
│  • 9 AI Agents                                                │
│  • Supplier Management                                        │
└───────────┬───────────────────────────────────────────────────┘
            │
            ├─→ Anthropic API (Claude AI)
            ├─→ S3 (Static Assets, if needed)
            └─→ DynamoDB/RDS (if configured)
```

### Current Production Configuration

**Frontend (Vercel):**
- **URL**: `https://www.esgnavigator.ai`
- **Deployment**: Automatic from GitHub
- **API Endpoint**: `https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod`
- **Static Assets**: Served by Vercel CDN + S3

**Backend (AWS Lambda):**
- **URL**: `https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod`
- **Region**: us-east-1
- **Runtime**: Node.js 20
- **Status**: ✅ **Already Deployed**

**Storage (AWS S3):**
- **Status**: ✅ **Already Activated**
- **Usage**: Static assets, file uploads, document storage

---

## Local Development Architecture (Docker)

```
┌─────────────────────────────────────────────────────────────────┐
│                   LOCAL DEVELOPMENT ENVIRONMENT                  │
└─────────────────────────────────────────────────────────────────┘

Developer Machine
├── Docker Compose
│   ├── PostgreSQL (port 5432)
│   │   └── Database: esgnavigator
│   │
│   ├── Redis (port 6379)
│   │   └── Cache & Sessions
│   │
│   ├── API Backend (port 8080)
│   │   ├── Express.js
│   │   ├── Claude AI Integration
│   │   └── Business Logic
│   │
│   ├── Web Frontend (port 3000)
│   │   ├── Next.js Dev Server
│   │   ├── Hot Reload
│   │   └── API calls to localhost:5050 or localhost:8080
│   │
│   └── Nginx (ports 80, 443)
│       ├── SSL Termination
│       ├── Reverse Proxy
│       └── Load Balancing
│
└── Status: ✅ **Currently Running**
```

### Local Development URLs

```
Frontend:      http://localhost:3000
API:           http://localhost:8080  (via Docker)
               http://localhost:5050  (direct API)
Database:      postgresql://esguser:pass@localhost:5432/esgnavigator
Redis:         redis://localhost:6379
Nginx:         http://localhost:80
               https://localhost:443
```

---

## Environment Configuration

### Production Environment Variables

**File**: `esg-navigator/apps/web/.env.production`

```bash
# AWS Lambda + S3 Configuration
NEXT_PUBLIC_API_URL=https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod
API_BACKEND_URL=https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod
NEXT_PUBLIC_WS_URL=wss://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod
NEXT_PUBLIC_ENV=production
```

### Local Development Environment Variables

**File**: `esg-navigator/apps/web/.env.local`

```bash
# Local Docker Configuration
API_BASE=http://localhost:5050
NEXT_PUBLIC_API_URL=http://localhost:5050
API_PROXY_KEY=dev-shared-secret
```

### Switching Between Environments

**For Local Development:**
```bash
# Use .env.local (already configured)
npm run dev
# Connects to localhost:5050 or localhost:8080
```

**For Production:**
```bash
# Use .env.production (points to Lambda)
npm run build
npm start
# Or deploy to Vercel (auto-uses .env.production)
```

---

## Deployment Workflows

### Production Deployment

#### Frontend (Vercel)

**Automatic Deployment:**
1. Push to `main` branch
2. Vercel detects changes
3. Builds Next.js app
4. Deploys to CDN
5. Live at `www.esgnavigator.ai`

**Manual Deployment:**
```bash
cd esg-navigator/apps/web
vercel --prod
```

#### Backend (AWS Lambda)

**Current Status**: Already deployed ✅

**To Update Lambda:**
```bash
# Option 1: AWS SAM
sam build
sam deploy --guided

# Option 2: Serverless Framework
cd esg-navigator/apps/api
serverless deploy --stage production

# Option 3: AWS CLI
aws lambda update-function-code \
  --function-name esg-navigator-api \
  --zip-file fileb://function.zip
```

### Local Development Workflow

```bash
# Start Docker containers
cd esg-navigator
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

## API Endpoints

### Production Lambda Endpoints

Base URL: `https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod`

```
GET  /health                      - Health check
GET  /api/suppliers               - List suppliers
POST /api/claude/chat             - Claude AI chat
POST /api/claude/analyze-supplier - Analyze supplier ESG
POST /api/claude/generate-report  - Generate ESG report
GET  /api/agents                  - List AI agents
POST /api/agents/:agentName       - Run specific agent
```

### Testing Production API

```bash
# Health check
curl https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod/health

# Test suppliers endpoint
curl https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod/api/suppliers
```

**Note**: If you get 403 errors, the Lambda may require:
- API key authentication
- IAM authorization
- Specific headers

---

## Domain Configuration

### Current Setup

| Domain | Points To | Status | Purpose |
|--------|-----------|--------|---------|
| `www.esgnavigator.ai` | Vercel | ✅ Active | Main frontend |
| `app.esgnavigator.ai` | Redirect → www/dashboard | ✅ Active | Alternative URL |
| `esgnavigator.ai` | Redirect → www | ✅ Active | Apex redirect |

### Lambda API Access

**Current**: Accessed via full Lambda URL
**Future Option**: Configure custom domain `api.esgnavigator.ai` → Lambda

**To add custom domain to Lambda:**
1. AWS API Gateway → Custom Domain Names
2. Create: `api.esgnavigator.ai`
3. Map to Lambda API
4. Add DNS CNAME: `api` → API Gateway domain

---

## Cost Optimization

### Current Architecture Benefits

**AWS Lambda:**
- ✅ Pay per request (no idle costs)
- ✅ Auto-scaling
- ✅ No server management
- ✅ Free tier: 1M requests/month

**Vercel:**
- ✅ Free tier for personal projects
- ✅ Automatic CDN distribution
- ✅ Edge network globally
- ✅ Zero-config deployments

**S3:**
- ✅ Pay for storage only
- ✅ Low cost ($0.023/GB)
- ✅ High durability
- ✅ CDN integration

---

## Monitoring & Debugging

### Production Monitoring

**Vercel Analytics:**
- Visit: Vercel Dashboard → Analytics
- View: Page views, performance, errors

**AWS CloudWatch (Lambda):**
```bash
# View Lambda logs
aws logs tail /aws/lambda/esg-navigator-api --follow

# View Lambda metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=esg-navigator-api \
  --start-time 2025-11-25T00:00:00Z \
  --end-time 2025-11-25T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

### Local Development Debugging

**Docker Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web

# Last 100 lines
docker-compose logs --tail=100 api
```

**Container Shell Access:**
```bash
# Access API container
docker-compose exec api sh

# Access database
docker-compose exec postgres psql -U esguser esgnavigator

# Access Redis
docker-compose exec redis redis-cli
```

---

## Security Configuration

### Production Security

**Vercel:**
- ✅ Automatic HTTPS
- ✅ HSTS enabled
- ✅ Security headers configured
- ✅ DDoS protection

**AWS Lambda:**
- ✅ IAM authentication (if configured)
- ✅ API Gateway throttling
- ✅ VPC integration (optional)
- ✅ Encryption at rest

**Best Practices:**
- Rotate API keys quarterly
- Use environment variables (never hardcode)
- Enable CloudWatch alarms
- Configure WAF rules (if needed)
- Use Secrets Manager for sensitive data

---

## Troubleshooting

### Lambda 403 Errors

**Problem**: `curl` returns 403 Forbidden

**Possible Causes:**
1. API key required
2. IAM authorization
3. Resource policy restrictions
4. CORS configuration

**Solution:**
```bash
# Check if API key is required
# Add x-api-key header
curl -H "x-api-key: your-api-key" \
  https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod/health

# Check Lambda configuration
aws lambda get-function --function-name esg-navigator-api

# Check API Gateway settings
aws apigateway get-rest-apis
```

### Vercel Deployment Issues

**Problem**: Build fails or environment variables not working

**Solution:**
1. Check Vercel Dashboard → Deployments → Logs
2. Verify environment variables are set
3. Ensure variables have correct scope (Production/Preview)
4. Redeploy: `vercel --prod --force`

### Docker Container Issues

**Problem**: Containers won't start

**Solution:**
```bash
# Check logs
docker-compose logs

# Remove and rebuild
docker-compose down -v
docker-compose up -d --build

# Check disk space
df -h

# Check ports
netstat -tulpn | grep -E "3000|8080|5432"
```

---

## Next Steps

### Immediate Actions

1. ✅ **Verify Lambda is working**
   ```bash
   curl https://c42puawyg8.execute-api.us-east-1.amazonaws.com/Prod/health
   ```

2. ✅ **Deploy frontend to Vercel**
   ```bash
   cd esg-navigator/apps/web
   vercel --prod
   ```

3. ✅ **Configure custom domains**
   - Add `www.esgnavigator.ai` to Vercel
   - Add DNS records

4. ✅ **Test end-to-end**
   - Visit `https://www.esgnavigator.ai`
   - Test dashboard
   - Verify API calls work

### Future Enhancements

- [ ] Add custom domain to Lambda (`api.esgnavigator.ai`)
- [ ] Set up CloudWatch alarms
- [ ] Configure API Gateway caching
- [ ] Add WAF rules for security
- [ ] Implement database (RDS or DynamoDB)
- [ ] Add Sentry error tracking
- [ ] Set up CI/CD with GitHub Actions

---

## Support & Resources

**Documentation:**
- VERCEL-DEPLOYMENT.md - Vercel deployment guide
- API-DEPLOYMENT.md - API backend deployment options
- DNS-CONFIGURATION.md - DNS setup guide
- SITE-MAPPING.md - Architecture overview

**AWS Resources:**
- Lambda Console: https://console.aws.amazon.com/lambda
- API Gateway: https://console.aws.amazon.com/apigateway
- S3 Console: https://console.aws.amazon.com/s3
- CloudWatch Logs: https://console.aws.amazon.com/cloudwatch

**Vercel Resources:**
- Dashboard: https://vercel.com/dashboard
- Deployments: https://vercel.com/dashboard/deployments
- Analytics: https://vercel.com/dashboard/analytics

**Contact:**
- Technical Lead: admin@tisholdings.co.za
- Support: support@tisholdings.co.za

---

**Last Updated**: 2025-11-25
**Current Status**: Production - Lambda + S3 + Vercel (Active) | Local - Docker (Running)
