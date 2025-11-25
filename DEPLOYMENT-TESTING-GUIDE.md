# Deployment & Testing Guide - ESG Navigator Agent System v2

> **Complete guide for deploying and testing the agent system**

---

## 🎯 Quick Start: Local Testing (5 minutes)

### Prerequisites
- Node.js 18+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys))
- Git repository cloned

### Step-by-Step

```bash
# 1. Navigate to API directory
cd esg-navigator/apps/api

# 2. Run setup script
chmod +x setup-local.sh
./setup-local.sh

# 3. Edit .env file and add your ANTHROPIC_API_KEY
nano .env  # or use your preferred editor

# Add this line:
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# 4. Start the server
npm run dev

# 5. Server should start on http://localhost:5050
```

### Verify Installation

Open another terminal and test:

```bash
# 1. Health check
curl http://localhost:5050/health

# Expected response:
# {
#   "status": "healthy",
#   "claude": "configured",
#   "agents": 9
# }

# 2. Login to get token
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tisholdings.co.za",
    "password": "admin123"
  }'

# Save the token from response

# 3. List available agents
curl http://localhost:5050/api/agents/v2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected: List of 2 agents (esg-assessment-v2, recommendation-agent)
```

---

## 🧪 Testing Scenarios

### Test 1: ESG Assessment Agent

Create a test file: `test-assessment.sh`

```bash
#!/bin/bash

TOKEN="your-token-here"  # Replace with actual token from login

curl -X POST http://localhost:5050/api/agents/v2/esg-assessment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "supplierId": "123e4567-e89b-12d3-a456-426614174000",
    "supplierName": "Test Manufacturing Corp",
    "industry": "Manufacturing",
    "country": "South Africa",
    "contractValue": 5000000,
    "documents": [
      {
        "type": "sustainability_report",
        "title": "2024 Sustainability Report",
        "content": "Our company has implemented comprehensive environmental management systems. We achieved 30% reduction in carbon emissions over the past 3 years through renewable energy adoption and efficiency improvements. Our waste recycling rate stands at 75%, with zero waste to landfill for hazardous materials. We employ 2,500 people across 3 facilities with strong labor practices: living wages, safe working conditions, and zero tolerance for discrimination. Our board comprises 40% independent directors, with 50% women representation in leadership roles. We publish annual sustainability reports aligned with GRI standards.",
        "year": 2024
      },
      {
        "type": "certificate",
        "title": "ISO 14001 Environmental Certification",
        "content": "Certified ISO 14001:2015 Environmental Management System. Last audit conducted in March 2024 with zero non-conformances. Certification covers all operational sites.",
        "year": 2024
      }
    ],
    "previousScore": 72
  }' | jq '.'

# The | jq '.' formats the JSON output nicely
```

**Expected Output:**
- Overall ESG score (0-100)
- Scores for Environmental, Social, Governance
- 12 subcategory scores
- Strengths and weaknesses lists
- Risk assessments with severity levels
- Trend analysis
- Industry comparison
- Recommendations
- Confidence score (should be 80+ with 2 documents)

### Test 2: Recommendation Agent

```bash
#!/bin/bash

TOKEN="your-token-here"

curl -X POST http://localhost:5050/api/agents/v2/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "supplierId": "123e4567-e89b-12d3-a456-426614174000",
    "supplierName": "Test Manufacturing Corp",
    "industry": "Manufacturing",
    "esgAssessment": {
      "overallScore": 72,
      "scores": {
        "environmental": { "score": 68 },
        "social": { "score": 75 },
        "governance": { "score": 73 }
      },
      "weaknesses": [
        "Carbon reduction targets not defined",
        "Limited community engagement programs",
        "Supply chain transparency gaps"
      ],
      "risks": [
        {
          "category": "environmental",
          "severity": "high",
          "description": "Carbon emissions tracking incomplete"
        }
      ]
    },
    "budget": "medium",
    "timeline": "short_term"
  }' | jq '.'
```

**Expected Output:**
- 5-8 prioritized recommendations
- Quick wins identified
- Strategic initiatives separated
- Implementation plans with steps, timelines, costs
- KPIs for each recommendation
- Implementation roadmap
- Total cost estimate

### Test 3: Error Handling

Test validation:

```bash
# Missing required field (should fail)
curl -X POST http://localhost:5050/api/agents/v2/esg-assessment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "supplierName": "Test Corp"
  }' | jq '.'

# Expected: 400 error with validation details
```

---

## 🚀 Deployment Options

### **Option A: Railway (Recommended for Quick Deploy)**

Railway provides easy deployment with built-in PostgreSQL and Redis.

#### Step 1: Prepare for Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project (from esg-navigator/apps/api directory)
cd esg-navigator/apps/api
railway init

# 4. Add PostgreSQL (if needed for future)
railway add postgresql

# 5. Add Redis (for agent caching)
railway add redis
```

#### Step 2: Configure Environment Variables

In Railway dashboard, add:

```env
NODE_ENV=production
PORT=5050
FRONTEND_URL=https://your-frontend-url.com
JWT_SECRET=generate-strong-random-secret-here
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_MAX_TOKENS=4096
LOG_LEVEL=info
API_VERSION=v2
```

#### Step 3: Deploy

```bash
railway up
```

Railway will auto-deploy on every git push.

**Cost**: ~$5-10/month

---

### **Option B: Vercel (For Full Stack)**

Best for deploying both frontend and API together.

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Configure vercel.json

Create `esg-navigator/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/api/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/api/src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "ANTHROPIC_API_KEY": "@anthropic_api_key",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

#### Step 3: Deploy

```bash
cd esg-navigator
vercel

# Add environment variables when prompted
vercel env add ANTHROPIC_API_KEY
vercel env add JWT_SECRET

# Deploy to production
vercel --prod
```

**Cost**: $20/month (Pro plan)

---

### **Option C: AWS (For Enterprise)**

Complete AWS deployment with ECS, RDS, ElastiCache.

#### Architecture

```
Users → CloudFront → ALB → ECS (API Containers)
                            ↓
                    RDS PostgreSQL
                    ElastiCache Redis
```

#### Quick Deploy with CDK

Create `infrastructure/cdk/esg-navigator-stack.ts`:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';

export class ESGNavigatorStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'ESGNavigatorVPC', {
      maxAzs: 2,
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'ESGCluster', { vpc });

    // RDS PostgreSQL
    const database = new rds.DatabaseInstance(this, 'ESGDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
    });

    // ElastiCache Redis
    const redis = new elasticache.CfnCacheCluster(this, 'ESGRedis', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1,
      vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
    });

    // ECS Service with Fargate
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'ESGTaskDef'
    );

    const container = taskDefinition.addContainer('api', {
      image: ecs.ContainerImage.fromRegistry('your-ecr-repo/esg-api'),
      environment: {
        NODE_ENV: 'production',
        DATABASE_URL: database.instanceEndpoint.socketAddress,
        REDIS_URL: redis.attrRedisEndpointAddress,
      },
      secrets: {
        ANTHROPIC_API_KEY: ecs.Secret.fromSecretsManager(
          // Configure in AWS Secrets Manager
        ),
      },
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'esg-api' }),
    });

    container.addPortMappings({ containerPort: 5050 });

    new ecs.FargateService(this, 'ESGService', {
      cluster,
      taskDefinition,
      desiredCount: 2, // For HA
    });
  }
}
```

Deploy:

```bash
cd infrastructure/cdk
npm install
cdk bootstrap
cdk deploy
```

**Cost**: ~$50-100/month (t3.micro instances)

---

### **Option D: DigitalOcean App Platform**

Simple and cost-effective.

#### Step 1: Create App

1. Go to DigitalOcean → App Platform
2. Connect GitHub repo
3. Select `esg-navigator/apps/api` as source

#### Step 2: Configure

```yaml
name: esg-navigator-api
services:
  - name: api
    source_dir: esg-navigator/apps/api
    github:
      repo: your-username/ESG-Navigator-Pro
      branch: main
    build_command: npm run build
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
      - key: ANTHROPIC_API_KEY
        value: ${ANTHROPIC_API_KEY}
        type: SECRET
      - key: JWT_SECRET
        value: ${JWT_SECRET}
        type: SECRET
    http_port: 5050
databases:
  - name: esg-db
    engine: PG
    version: "15"
```

**Cost**: ~$12-25/month

---

## 🧪 Testing Environments

### 1. **Local Development**
```
http://localhost:5050
- For development and testing
- Uses local env variables
- Fast iteration
```

### 2. **Staging/Preview** (Vercel/Railway)
```
https://esg-navigator-staging.vercel.app
- Deploy preview branches
- Test before production
- Client demos
```

### 3. **Production**
```
https://api.esgnavigator.ai
- Live production API
- Multi-tenant data
- Monitoring enabled
```

---

## 📊 Monitoring & Testing in Production

### Health Checks

```bash
# API Health
curl https://api.esgnavigator.ai/health

# Agent Status
curl https://api.esgnavigator.ai/api/agents/v2/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Performance Monitoring

Set up monitoring with:

1. **DataDog APM** (recommended)
   ```bash
   npm install dd-trace
   ```

2. **New Relic**
   ```bash
   npm install newrelic
   ```

3. **CloudWatch** (for AWS)
   - Automatic with ECS

### Log Aggregation

- **Railway**: Built-in logs
- **Vercel**: Real-time logs in dashboard
- **AWS**: CloudWatch Logs
- **Self-hosted**: ELK Stack or Loki

### Cost Tracking

Monitor Claude API usage:

```typescript
// Add to agent execution logging
console.log({
  tenant: context.tenantId,
  tokensUsed: metadata.tokensUsed.total,
  estimatedCost: (metadata.tokensUsed.total / 1000) * 0.003,
  timestamp: new Date().toISOString(),
});
```

Set up alerts:
- Token usage > 500K/day per tenant
- Cost > $100/day
- Error rate > 5%

---

## 🔐 Production Security Checklist

Before deploying to production:

- [ ] Strong JWT_SECRET (64+ random characters)
- [ ] ANTHROPIC_API_KEY stored in secrets manager
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled (use express-rate-limit)
- [ ] HTTPS/TLS enforced
- [ ] API authentication required for all agent endpoints
- [ ] Input validation with Zod (already implemented)
- [ ] Error messages don't expose secrets
- [ ] Logging excludes sensitive data
- [ ] Database connections use SSL
- [ ] Redis requires password (if exposed)

---

## 🎯 Recommended Deployment Path

**For TIS Holdings / ESG Navigator:**

### Phase 1: Local Testing (Now)
1. Follow "Quick Start: Local Testing" above
2. Test both agents thoroughly
3. Validate with sample supplier data

### Phase 2: Staging Deployment (This Week)
1. Deploy to **Railway** for easy setup
   - Quick deployment
   - Built-in PostgreSQL + Redis
   - Automatic HTTPS
   - Cost: ~$10/month

2. Test with real supplier data
3. Conduct user acceptance testing

### Phase 3: Production (Next Week)
1. Deploy to **Vercel** (if front-end + API together)
   - OR **AWS ECS** (if enterprise requirements)
   - Enable monitoring (DataDog/CloudWatch)
   - Set up cost alerts
   - Configure backups

### Phase 4: Scale (Month 2+)
1. Add more agents (compliance, risk, etc.)
2. Enable Redis caching for performance
3. Implement rate limiting per tenant
4. Add analytics dashboard

---

## 📞 Support Checklist

Once deployed, document:

- [ ] API URL: `https://api.esgnavigator.ai`
- [ ] Health check: `https://api.esgnavigator.ai/health`
- [ ] Admin credentials
- [ ] ANTHROPIC_API_KEY location (secrets manager)
- [ ] Database connection string
- [ ] Redis connection string
- [ ] Monitoring dashboard URL
- [ ] Log aggregation URL
- [ ] On-call rotation (if enterprise)

---

## 🚨 Troubleshooting

### Agent returns "Invalid API key"
```bash
# Check env variable
echo $ANTHROPIC_API_KEY

# Should start with sk-ant-api03-
```

### "Agent not found" error
```bash
# Verify agents registered on startup
# Check logs for: "[AgentRegistry] Registration complete"
```

### Slow response times
```bash
# Check token usage
# Reduce ANTHROPIC_MAX_TOKENS if needed
# Enable Redis caching
```

### High costs
```bash
# Review token usage per tenant
# Implement caching
# Use prompt optimization
# Consider Claude Haiku for simple tasks
```

---

## 📈 Success Metrics

Track these KPIs:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| API Uptime | 99.5%+ | Health checks |
| Average Response Time | <10s | Agent metadata |
| Agent Success Rate | >95% | Error logs |
| Cost per Assessment | <$2 | Token usage tracking |
| User Satisfaction | >4/5 | Feedback surveys |

---

**Ready to deploy?** Start with local testing, then move to Railway for staging! 🚀

---

*Last Updated: 2025-11-25*
*For: TIS Holdings / ESG Navigator*
