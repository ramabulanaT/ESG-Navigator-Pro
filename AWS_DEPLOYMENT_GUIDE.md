# AWS Multi-Domain Deployment Guide

Complete guide for deploying ESG Navigator to AWS with Lambda, S3, and CloudFront supporting three domains:
- **tis-holdings.com** → Marketing division
- **esgnavigator.ai** → Education division
- **tis-intellimat.net** → Enterprise division

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CloudFront CDN                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  tis-holdings.com → (marketing)                  │  │
│  │  esgnavigator.ai → (education)                   │  │
│  │  tis-intellimat.net → (enterprise)               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                                    │
         ├─────────────────┬─────────────────┤
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │ Lambda  │      │   S3    │      │ Lambda  │
    │  (SSR)  │      │ Static  │      │ (Image) │
    └─────────┘      └─────────┘      └─────────┘
```

### Components:
- **CloudFront**: CDN with 3 domain aliases, SSL certificates
- **Lambda@Edge/Lambda**: Server-side rendering (via OpenNext)
- **S3**: Static assets (_next/static, images, etc.)
- **Route 53** (optional): DNS management
- **ACM**: SSL certificates (us-east-1)

---

## 📋 Prerequisites

### 1. AWS Account Setup
- AWS account with appropriate permissions
- AWS CLI installed and configured
- AWS credentials configured (`aws configure`)

### 2. Domain Ownership
You must own and have access to:
- `tis-holdings.com`
- `esgnavigator.ai`
- `tis-intellimat.net`

### 3. SSL Certificates (ACM)
**CRITICAL:** Certificates must be in **us-east-1** for CloudFront!

```bash
# Request certificate in us-east-1
aws acm request-certificate \
  --domain-name tis-holdings.com \
  --subject-alternative-names \
    "*.tis-holdings.com" \
    "esgnavigator.ai" \
    "*.esgnavigator.ai" \
    "tis-intellimat.net" \
    "*.tis-intellimat.net" \
  --validation-method DNS \
  --region us-east-1
```

Validate via DNS (add CNAME records provided by ACM).

### 4. Tools Required
```bash
# Install Node.js dependencies
npm install

# Install AWS CLI
# macOS: brew install awscli
# Linux: apt-get install awscli
# Windows: Download from aws.amazon.com/cli

# Verify installation
aws --version
node --version
npm --version
```

---

## 🚀 Deployment Steps

### Step 1: Clone and Setup

```bash
# Clone repository
git clone https://github.com/your-org/ESG-Navigator-Pro.git
cd ESG-Navigator-Pro/esg-navigator

# Install dependencies
npm install

# Setup environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your values
```

### Step 2: Build Application

```bash
cd apps/web

# Build Next.js application
npm run build

# Build for AWS with OpenNext
npm run build:aws
```

This creates `.open-next/` directory with:
- `server-function/` - Lambda function for SSR
- `image-optimization-function/` - Lambda for Next.js image optimization
- `assets/` - Static assets for S3

### Step 3: Deploy Infrastructure

```bash
cd ../../infrastructure/aws

# Deploy CloudFormation stack
./deploy-infrastructure.sh production arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID
```

**Replace** `arn:aws:acm:...` with your actual ACM certificate ARN.

This creates:
- S3 buckets for static assets and deployments
- Lambda functions (placeholder)
- CloudFront distribution with 3 domains
- IAM roles and policies

**Wait time:** 15-20 minutes for CloudFront distribution creation.

### Step 4: Deploy Application

```bash
cd ../../apps/web

# Deploy application code
./scripts/deploy-aws.sh production
```

This:
1. Packages Lambda functions
2. Uploads to S3
3. Updates Lambda function code
4. Syncs static assets to S3
5. Invalidates CloudFront cache

**Wait time:** 5-10 minutes for cache invalidation.

### Step 5: Configure DNS

Point your domains to CloudFront distribution:

```bash
# Get CloudFront domain name
aws cloudformation describe-stacks \
  --stack-name esg-navigator-production \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text
```

**DNS Records (in your domain registrar):**

```
tis-holdings.com        CNAME  d1234567890.cloudfront.net
www.tis-holdings.com    CNAME  d1234567890.cloudfront.net
esgnavigator.ai         CNAME  d1234567890.cloudfront.net
www.esgnavigator.ai     CNAME  d1234567890.cloudfront.net
tis-intellimat.net      CNAME  d1234567890.cloudfront.net
www.tis-intellimat.net  CNAME  d1234567890.cloudfront.net
```

**Or use Route 53 Alias records** (recommended):
- Create A record with Alias to CloudFront distribution
- No CNAME needed

---

## 🧪 Testing

### Local Testing (Before Deployment)

Test domain routing locally:

```bash
# Add to /etc/hosts (macOS/Linux)
127.0.0.1 tis-holdings.local
127.0.0.1 esgnavigator.local
127.0.0.1 tis-intellimat.local

# Run dev server
npm run dev

# Test domains
curl http://tis-holdings.local:3000
curl http://esgnavigator.local:3000
curl http://tis-intellimat.local:3000
```

### Production Testing

After deployment:

```bash
# Test each domain
curl -I https://tis-holdings.com
curl -I https://esgnavigator.ai
curl -I https://tis-intellimat.net

# Check SSL
openssl s_client -connect tis-holdings.com:443 -servername tis-holdings.com

# Check routing
curl -H "Host: esgnavigator.ai" https://CLOUDFRONT_DOMAIN/
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Example)

```yaml
# .github/workflows/deploy-aws.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build:aws
        working-directory: ./esg-navigator/apps/web

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to AWS
        run: ./scripts/deploy-aws.sh production
        working-directory: ./esg-navigator/apps/web
```

---

## 💰 Cost Estimation

### Monthly Costs (Moderate Traffic)

| Service | Usage | Cost |
|---------|-------|------|
| **CloudFront** | 1TB data transfer | ~$85 |
| **Lambda** | 10M requests, 512MB, 1s avg | ~$20 |
| **S3** | 50GB storage, 1M requests | ~$2 |
| **ACM** | SSL certificates | FREE |
| **Route 53** (optional) | 3 hosted zones | ~$1.50 |
| **Total** | | **~$108/month** |

### High Traffic (Enterprise Scale)

| Service | Usage | Cost |
|---------|-------|------|
| **CloudFront** | 10TB data transfer | ~$850 |
| **Lambda** | 100M requests | ~$200 |
| **S3** | 500GB storage | ~$12 |
| **Total** | | **~$1,062/month** |

**Savings Tips:**
- Use CloudFront caching effectively (reduce Lambda invocations)
- Enable Gzip/Brotli compression
- Use S3 Intelligent-Tiering for storage
- Monitor and optimize Lambda memory allocation

---

## 🔧 Troubleshooting

### Issue: Certificate Validation Fails

**Solution:**
- Ensure certificate is in us-east-1
- Check DNS records for validation
- Wait up to 30 minutes for validation

### Issue: Domain Not Resolving

**Solution:**
```bash
# Check DNS propagation
dig tis-holdings.com
dig esgnavigator.ai

# Check CloudFront
aws cloudfront get-distribution --id DIST_ID
```

### Issue: Lambda Timeout

**Solution:**
- Increase Lambda timeout (max 30s for Lambda@Edge)
- Optimize code or use Lambda (not Edge) for longer timeouts
- Consider caching more aggressively

### Issue: Wrong Content Served

**Solution:**
```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DIST_ID \
  --paths "/*"

# Check middleware logic
# Verify hostname matching in middleware.ts
```

---

## 📊 Monitoring

### CloudWatch Dashboards

```bash
# View Lambda logs
aws logs tail /aws/lambda/esg-navigator-server-production --follow

# View CloudFront metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=DIST_ID \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### Key Metrics to Monitor

- **CloudFront**: Requests, Data Transfer, Error Rate
- **Lambda**: Invocations, Duration, Errors, Throttles
- **S3**: Storage, Requests

---

## 🔐 Security Best Practices

### 1. Least Privilege IAM

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "s3:PutObject",
        "cloudfront:CreateInvalidation"
      ],
      "Resource": [
        "arn:aws:lambda:*:*:function:esg-navigator-*",
        "arn:aws:s3:::esg-navigator-*/*",
        "arn:aws:cloudfront::*:distribution/*"
      ]
    }
  ]
}
```

### 2. Environment Variables

- Never commit secrets to git
- Use AWS Secrets Manager or Parameter Store
- Rotate keys regularly

### 3. CloudFront Security

- Enable Origin Shield
- Use signed URLs/cookies for private content
- Enable WAF for DDoS protection

---

## 🚀 Advanced: Separate Deployments per Division

For true independence:

```
esgnavigator.ai      → Lambda: esg-nav-education
tis-intellimat.net   → Lambda: tis-intellimat-enterprise (High memory)
tis-holdings.com     → S3 static site (No Lambda needed)
```

Benefits:
- Scale enterprise independently
- Different Lambda configs per division
- Lower costs for marketing (static only)

---

## 📞 Support

### AWS Support
- [AWS Forums](https://forums.aws.amazon.com/)
- AWS Support Plans

### OpenNext
- [OpenNext GitHub](https://github.com/serverless-stack/open-next)
- [Documentation](https://open-next.js.org/)

---

## ✅ Deployment Checklist

- [ ] AWS account created and configured
- [ ] Domains purchased (tis-holdings.com, esgnavigator.ai, tis-intellimat.net)
- [ ] SSL certificates requested and validated (us-east-1)
- [ ] Environment variables configured (.env.local)
- [ ] Application built (`npm run build:aws`)
- [ ] Infrastructure deployed (CloudFormation)
- [ ] Application code deployed (Lambda + S3)
- [ ] DNS configured (CNAME/Alias records)
- [ ] Testing completed (all 3 domains)
- [ ] Monitoring configured (CloudWatch)
- [ ] CI/CD pipeline setup (optional)

---

**Your ESG Navigator is now deployed to AWS with multi-domain support!** 🎉
