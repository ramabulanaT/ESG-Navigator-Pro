# 🚀 JSE ROADSHOW DEPLOYMENT - EXECUTE THIS!

**Target:** Friday JSE SME Rise Capital Matching Roadshow
**Domains:** tis-holdings.com, esgnavigator.ai, tis-intellimat.net
**Divisions:** Education + Enterprise (Both!)

---

## ⚡ RAPID DEPLOYMENT CHECKLIST

### ✅ Prerequisites Check
- [ ] AWS CLI installed and configured
- [ ] Node.js 18+ installed
- [ ] Domains owned (tis-holdings.com, esgnavigator.ai, tis-intellimat.net)
- [ ] Access to domain DNS settings

**Test AWS:**
```bash
aws sts get-caller-identity
# Should show your AWS account ID
```

---

## 🔥 DEPLOYMENT SEQUENCE (Copy/Paste These Commands)

### **STEP 1: Request SSL Certificate** (5 mins)

```bash
# Navigate to project
cd /path/to/ESG-Navigator-Pro/esg-navigator

# Request certificate (MUST be in us-east-1 for CloudFront!)
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

**OUTPUT:** You'll get a Certificate ARN like:
```
arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

**SAVE THIS ARN!** You'll need it in Step 3.

---

### **STEP 2: Validate Certificate** (5-30 mins)

```bash
# Get your certificate ARN from Step 1
CERT_ARN="arn:aws:acm:us-east-1:YOUR-ACCOUNT-ID:certificate/YOUR-CERT-ID"

# Get DNS validation records
aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --region us-east-1 \
  --query 'Certificate.DomainValidationOptions[*].[DomainName,ResourceRecord.Name,ResourceRecord.Value]' \
  --output table
```

**You'll see 6 DNS records to add (one per domain/subdomain):**

**Add these CNAME records to your DNS:**

For each domain, add:
```
Name:  _abc123.tis-holdings.com
Type:  CNAME
Value: _xyz789.acm-validations.aws.
TTL:   300
```

**Where to add:** Your domain registrar's DNS management panel.

**Wait for validation:**
```bash
# Check validation status (repeat until all are SUCCESS)
aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --region us-east-1 \
  --query 'Certificate.DomainValidationOptions[*].[DomainName,ValidationStatus]' \
  --output table
```

**Status should change from PENDING_VALIDATION → SUCCESS** (5-30 minutes)

---

### **STEP 3: Deploy Infrastructure** (20 mins)

```bash
cd infrastructure/aws

# Set your certificate ARN from Step 1
export CERT_ARN="arn:aws:acm:us-east-1:YOUR-ACCOUNT-ID:certificate/YOUR-CERT-ID"

# Deploy CloudFormation stack
./deploy-infrastructure.sh production $CERT_ARN
```

**This creates:**
- ✅ S3 buckets (static assets + deployments)
- ✅ Lambda functions (SSR + Image optimization)
- ✅ CloudFront distribution (3 domain aliases)
- ✅ IAM roles and policies

**⏰ Takes 15-20 minutes** - CloudFront is slow to create

**While this runs, you can start Step 4!**

---

### **STEP 4: Build Application** (10 mins)

Open a **NEW terminal** (while CloudFormation runs):

```bash
cd apps/web

# Install dependencies
npm install

# Build production app
npm run build

# Build for AWS Lambda (OpenNext)
npm run build:aws
```

**Check build succeeded:**
```bash
ls -la .open-next/
# Should see: server-function/, image-optimization-function/, assets/
```

---

### **STEP 5: Deploy Application** (15 mins)

**Wait for Step 3 CloudFormation to complete first!**

Check CloudFormation status:
```bash
aws cloudformation describe-stacks \
  --stack-name esg-navigator-production \
  --region us-east-1 \
  --query 'Stacks[0].StackStatus' \
  --output text
```

**Should say:** `CREATE_COMPLETE`

**Then deploy app:**
```bash
cd apps/web

# Deploy to AWS
./scripts/deploy-aws.sh production
```

**This:**
- ✅ Packages Lambda functions
- ✅ Uploads to S3
- ✅ Updates Lambda code
- ✅ Syncs static assets
- ✅ Invalidates CloudFront cache

**⏰ Takes 10-15 minutes**

---

### **STEP 6: Configure DNS** (5 mins + propagation time)

**Get CloudFront domain:**
```bash
aws cloudformation describe-stacks \
  --stack-name esg-navigator-production \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text
```

**You'll get:** `d1a2b3c4d5e6f7.cloudfront.net`

**Add these DNS records in your domain registrar:**

```
# TIS Holdings
tis-holdings.com        CNAME  d1a2b3c4d5e6f7.cloudfront.net
www.tis-holdings.com    CNAME  d1a2b3c4d5e6f7.cloudfront.net

# ESG Navigator (Education)
esgnavigator.ai         CNAME  d1a2b3c4d5e6f7.cloudfront.net
www.esgnavigator.ai     CNAME  d1a2b3c4d5e6f7.cloudfront.net

# TIS-Intellimat (Enterprise)
tis-intellimat.net      CNAME  d1a2b3c4d5e6f7.cloudfront.net
www.tis-intellimat.net  CNAME  d1a2b3c4d5e6f7.cloudfront.net
```

**TTL:** 300 (5 minutes)

**⏰ DNS Propagation:** 5 mins - 2 hours (usually ~30 mins)

---

### **STEP 7: Test Everything!** (10 mins)

**Wait for DNS propagation, then:**

```bash
# Test HTTPS on all domains
curl -I https://tis-holdings.com
curl -I https://esgnavigator.ai
curl -I https://tis-intellimat.net

# All should return: HTTP/2 200
```

**Browser test:**
1. **https://tis-holdings.com** → Landing page with both divisions
2. **https://esgnavigator.ai** → Education division (blue branding, assessments)
3. **https://tis-intellimat.net** → Enterprise division (dark branding, dashboard)

---

## 🎯 FRIDAY INVESTOR DEMO SCRIPT

### **Opening (30 seconds)**
> "Good morning! I'm presenting ESG Navigator - a dual-division AI-powered ESG platform built for the modern compliance era."

**Show:** `https://tis-holdings.com` (landing page)

### **Market Problem (1 minute)**
> "Companies face two challenges:
> 1. SMBs need affordable ESG education and compliance
> 2. Enterprises need AI-powered automation at scale
>
> Traditional platforms only serve one market. We serve both."

**Show:** Side-by-side division comparison on landing page

### **Education Division Demo (2 minutes)**
**Navigate to:** `https://esgnavigator.ai`

> "For SMBs and mid-market companies, ESG Navigator Education provides:
> - ISO framework assessments (14001, 45001, 50001, GISTM)
> - 9 comprehensive training modules
> - Self-serve implementation
> - R1,000 to R10,000 annual recurring revenue"

**Click through:**
- Assessments page (show ISO frameworks)
- Training center (show 9 modules)

### **Enterprise Division Demo (3 minutes)**
**Navigate to:** `https://tis-intellimat.net`

> "For Fortune 500 and large enterprises, TIS-Intellimat provides:
> - Real-time ESG intelligence powered by IBM WatsonX and Envizi
> - 9 specialized AI agents built on Anthropic Claude
> - Complete business platform with CRM, sales, analytics
> - R50,000 to R500,000 annual recurring revenue"

**Click through:**
- Dashboard (show real-time metrics)
- Suppliers (show R331M portfolio)
- Clients (TIS-Intellimat CRM)
- Analytics (IBM integration ready)
- AI Insights (9 agents)

### **Competitive Advantage (1 minute)**
> "Unlike SAP, Oracle, or point solutions:
> - We serve BOTH markets (diversified revenue)
> - IBM Partnership (WatsonX + Envizi integration ready)
> - 9 AI agents (automation differentiation)
> - Professional multi-domain presence
> - TIS-Intellimat integration (full business platform)"

### **Traction (30 seconds)**
> "Current status:
> - R331 million supplier portfolio under management
> - 9 operational AI agents
> - IBM integration architecture deployed
> - Production AWS infrastructure live
> - Multi-domain brand strategy executing"

### **Ask (30 seconds)**
> "Seeking R[X] million for:
> - Enterprise sales team
> - IBM integration completion
> - Domain SEO and brand awareness
> - Product development (additional agents)
>
> 18-month runway to R[X]M ARR with clear path to profitability."

---

## 📊 KEY METRICS FOR INVESTORS

### **Market Size**
- **SA SMBs:** 1M+ companies need ESG compliance
- **JSE Companies:** 500+ need mandatory ESG reporting (IFRS S1/S2)
- **Global Market:** $1B+ ESG software market growing 25% YoY

### **Revenue Potential**
- **Education:** 1,000 customers × R5K = R5M ARR
- **Enterprise:** 50 customers × R200K = R10M ARR
- **Total:** R15M ARR achievable in 18 months

### **Unit Economics**
- **CAC (Education):** R2,000 (digital marketing)
- **CAC (Enterprise):** R50,000 (sales team)
- **LTV:CAC Ratio:** 5:1 (healthy SaaS)
- **Gross Margin:** 85%+ (software)

---

## ⚠️ TROUBLESHOOTING

### **Certificate won't validate**
- Check DNS records are added correctly
- Wait 30 minutes
- Check in AWS Console → Certificate Manager

### **CloudFormation fails**
```bash
aws cloudformation describe-stack-events \
  --stack-name esg-navigator-production \
  --region us-east-1 | head -50
```

### **Domains not resolving**
- Check DNS propagation: `dig tis-holdings.com`
- May need to wait up to 48 hours (usually 1 hour)
- Use CloudFront URL temporarily for demo

### **Lambda errors**
```bash
aws logs tail /aws/lambda/esg-navigator-server-production --follow
```

---

## 🆘 BACKUP PLAN

**If domains aren't ready by Friday:**

Use CloudFront direct URL for demo:
```
https://d1a2b3c4d5e6f7.cloudfront.net
```

Add `?domain=esgnavigator.ai` or `?domain=tis-intellimat.net` to simulate domain routing.

---

## ✅ PRE-ROADSHOW CHECKLIST

**Wednesday Night:**
- [ ] All 3 domains accessible via HTTPS
- [ ] SSL certificates valid (no warnings)
- [ ] Test complete demo flow
- [ ] Screenshots for backup slides
- [ ] Practice 7-minute pitch

**Thursday:**
- [ ] Final test of all domains
- [ ] Prepare investor deck
- [ ] Print handouts with URLs
- [ ] Test on different devices (mobile, tablet)

**Friday Morning:**
- [ ] Test all 3 domains one more time
- [ ] Have CloudFront URL as backup
- [ ] Charged laptop, backup charger
- [ ] Business cards with domain URLs

---

## 🎉 YOU'VE GOT THIS!

**Total deployment time:** 2-3 hours
**Your advantage:** Professional multi-domain deployment
**Their reaction:** "Wow, this is production-ready!"

**Commands summary:**
1. Request SSL cert
2. Add DNS validation records
3. Deploy infrastructure (20 mins)
4. Build app (10 mins)
5. Deploy app (15 mins)
6. Configure domain DNS
7. TEST!

---

**Questions during deployment?** Check the error messages and:
- AWS Console → CloudFormation (stack events)
- AWS Console → Certificate Manager (validation status)
- AWS Console → CloudFront (distribution status)

**🇿🇦 SHOW THEM WHAT SA TECH CAN DO! 🚀**
