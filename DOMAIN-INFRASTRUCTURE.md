# TIS Holdings - Domain Infrastructure Configuration

## Domain-to-Infrastructure Mapping

### Production Domains

```yaml
domains:
  holding:
    domain: tisholdings.co.za
    status: active
    hosting: TBD
    purpose: Corporate holding company
    codebase: /TIS-Platform

  operations:
    domain: Tis-Intelimat.net
    status: active
    hosting: AWS
    dns: Route 53
    purpose: Operational systems and business intelligence
    codebase: /TIS-Platform

  research:
    domain: tis-holdings.com
    status: active
    hosting: TBD
    purpose: Research, innovation, and training
    codebase: /TIS-Platform

  saas:
    domain: esgnavigator.ai
    alternatives:
      - esgnavigator.co.za
      - esgnavigator.com
    status: planning
    hosting: Vercel (recommended) / AWS
    purpose: ESG/GRC SaaS platform
    codebase: /esg-navigator
```

---

## Infrastructure Architecture

### TIS-Platform Domains (Holdings, IntelliMat, Research)

```
┌─────────────────────────────────────────────────────┐
│               Load Balancer / Reverse Proxy          │
│                    (nginx / Traefik)                 │
└─────────────────────────────────────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
    ┌────────────┐ ┌────────────┐ ┌────────────┐
    │tisholdings │ │ IntelliMat │ │  Research  │
    │  .co.za    │ │   .net     │ │holdings.com│
    └────────────┘ └────────────┘ └────────────┘
           │             │             │
           └─────────────┼─────────────┘
                         │
                         ▼
           ┌──────────────────────────┐
           │   TIS-Platform Apps      │
           │   - Web (Next.js)        │
           │   - API (Node.js)        │
           └──────────────────────────┘
                         │
                         ▼
           ┌──────────────────────────┐
           │   PostgreSQL Database    │
           │   (Shared / Multi-tenant)│
           └──────────────────────────┘
```

**Routing Strategy**: Path-based or subdomain routing

#### Option 1: Path-based
```nginx
location /operations -> IntelliMat branding
location /research -> Research branding
location / -> Holdings branding
```

#### Option 2: Subdomain
```nginx
operations.tisholdings.co.za -> IntelliMat
research.tisholdings.co.za -> Research
www.tisholdings.co.za -> Holdings
```

#### Option 3: Separate Domains (Recommended)
- Each domain gets custom branding via environment variables
- Same codebase, different configurations
- Easier to manage and scale independently

---

### ESG Navigator (Standalone SaaS)

```
┌─────────────────────────────────────────────────────┐
│            esgnavigator.ai / .co.za                  │
│                   (Primary Domain)                   │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
           ┌──────────────────────────┐
           │   Vercel Edge Network    │
           │   (CDN + Edge Functions) │
           └──────────────────────────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
           ▼                           ▼
    ┌────────────┐            ┌──────────────┐
    │  Web App   │            │   API App    │
    │  (Next.js) │◄───────────┤  (Next.js)   │
    └────────────┘            └──────────────┘
           │                           │
           │                           ▼
           │              ┌──────────────────────────┐
           │              │  External Services       │
           │              │  - Anthropic Claude API  │
           │              │  - Stripe (payments)     │
           │              └──────────────────────────┘
           │
           ▼
    ┌────────────────────┐
    │   PostgreSQL       │
    │   (Vercel/Supabase)│
    └────────────────────┘
```

**Key Features**:
- Multi-tenant architecture
- Isolated data per client
- Scalable and globally distributed
- Integrated CI/CD via Vercel

---

## Environment Configuration

### TIS-Platform

Create domain-specific environment files:

**.env.holding**
```env
DOMAIN=tisholdings.co.za
BRAND_NAME=TIS Holdings
BRAND_COLOR=#1E40AF
FEATURES=governance,consolidation,reporting
ANALYTICS_ID=GA-HOLDING-XXX
```

**.env.intellimat**
```env
DOMAIN=Tis-Intelimat.net
BRAND_NAME=TIS-IntelliMat
BRAND_COLOR=#059669
FEATURES=operations,crm,analytics,suppliers
ANALYTICS_ID=GA-INTELLIMAT-XXX
AWS_ROUTE53_ZONE=ZXXXXXXXXXXXXX
```

**.env.research**
```env
DOMAIN=tis-holdings.com
BRAND_NAME=TIS Research & Innovation
BRAND_COLOR=#7C3AED
FEATURES=training,research,innovation,agents
ANALYTICS_ID=GA-RESEARCH-XXX
```

### ESG Navigator

**.env.production**
```env
# Application
NEXT_PUBLIC_APP_URL=https://esgnavigator.ai
NEXT_PUBLIC_APP_NAME=ESG Navigator

# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=https://esgnavigator.ai
NEXTAUTH_SECRET=...

# AI Services
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Payments
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Email
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
FROM_EMAIL=noreply@esgnavigator.ai

# Features
FEATURES_AGENTS=true
FEATURES_REALTIME=true
FEATURES_ADVANCED_ANALYTICS=true

# Monitoring
SENTRY_DSN=...
```

---

## DNS Configuration

### Route 53 (AWS) - IntelliMat

```yaml
hosted_zone:
  domain: Tis-Intelimat.net

records:
  - name: "@"
    type: A
    value: <server-ip>
    ttl: 300

  - name: "www"
    type: CNAME
    value: Tis-Intelimat.net
    ttl: 300

  - name: "@"
    type: MX
    value:
      - priority: 10
        value: mail.Tis-Intelimat.net
    ttl: 3600

  - name: "_dmarc"
    type: TXT
    value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@tis-intellimat.net"
```

### Other Domains

```yaml
tisholdings.co.za:
  registrar: TBD
  nameservers: TBD

tis-holdings.com:
  registrar: TBD
  nameservers: TBD

esgnavigator.ai:
  registrar: TBD
  nameservers: Vercel DNS (recommended) or AWS Route 53
```

---

## Database Architecture

### Multi-Domain Strategy

#### Option 1: Shared Database with Schema Separation
```sql
-- TIS-Platform
CREATE SCHEMA holdings;
CREATE SCHEMA intellimat;
CREATE SCHEMA research;

-- Shared tables
CREATE TABLE public.users (...);
CREATE TABLE public.organizations (...);

-- Domain-specific tables
CREATE TABLE intellimat.suppliers (...);
CREATE TABLE research.courses (...);
```

#### Option 2: Separate Databases (Recommended for isolation)
```
tis_holdings_db
tis_intellimat_db
tis_research_db
esg_navigator_db (separate, multi-tenant)
```

#### Option 3: Microservices with Database-per-Service
```
user_service → users_db
supplier_service → suppliers_db
analytics_service → analytics_db
```

### ESG Navigator Database

**Multi-Tenant Schema**:
```sql
-- Tenant isolation
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  subscription_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- All tables include tenant_id
CREATE TABLE suppliers (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  esg_score DECIMAL,
  -- ... other fields
);

-- Row-level security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON suppliers
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

---

## Agent Infrastructure

### Agent Service Architecture

```
                    ┌─────────────────┐
                    │  Agent Manager  │
                    │  (Orchestrator) │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
   ┌──────────┐       ┌──────────┐       ┌──────────┐
   │Assessment│       │ Advisory │       │Operation │
   │  Agent   │       │  Agent   │       │  Agent   │
   └──────────┘       └──────────┘       └──────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Message Bus   │
                    │   (Redis/Queue) │
                    └─────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              ┌──────────┐      ┌──────────┐
              │ Claude   │      │  State   │
              │   API    │      │  Store   │
              └──────────┘      └──────────┘
```

### Directory Structure for Agents

```
/esg-navigator/
  /apps/
    /api/
      /src/
        /agents/
          /core/
            agent-manager.ts      # Orchestrator
            agent-base.ts         # Base class
            agent-types.ts        # Type definitions
            agent-registry.ts     # Agent discovery
          /assessment/
            esg-assessment-agent.ts
            compliance-agent.ts
            risk-assessment-agent.ts
          /advisory/
            recommendation-agent.ts
            remediation-agent.ts
          /operational/
            data-collection-agent.ts
            report-generation-agent.ts
            notification-agent.ts
          /intelligence/
            market-research-agent.ts
            trend-analysis-agent.ts
        /services/
          anthropic.service.ts    # Claude API wrapper
          agent.service.ts        # Agent lifecycle
        /queues/
          agent-queue.ts          # Job queue

/TIS-Platform/
  /apps/
    /api/
      /src/
        /agents/
          # Shared agents for operations domain
```

---

## Deployment Strategy

### TIS-Platform Deployment

**Option 1: Docker Compose (Current)**
```yaml
# docker-compose.yml
services:
  web-holdings:
    build: ./apps/web
    environment:
      - DOMAIN=tisholdings.co.za
    ports:
      - "3000:3000"

  web-intellimat:
    build: ./apps/web
    environment:
      - DOMAIN=Tis-Intelimat.net
    ports:
      - "3001:3000"

  web-research:
    build: ./apps/web
    environment:
      - DOMAIN=tis-holdings.com
    ports:
      - "3002:3000"

  api:
    build: ./apps/api
    ports:
      - "4000:4000"

  postgres:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
```

**Option 2: Kubernetes (Future)**
```yaml
# Separate namespaces per domain
kubectl create namespace holdings
kubectl create namespace intellimat
kubectl create namespace research

# Deploy with Helm charts
helm install holdings ./charts/tis-platform -n holdings
helm install intellimat ./charts/tis-platform -n intellimat
helm install research ./charts/tis-platform -n research
```

### ESG Navigator Deployment

**Vercel (Recommended)**
```bash
# Link to Vercel
vercel link

# Set environment variables
vercel env add ANTHROPIC_API_KEY
vercel env add DATABASE_URL

# Deploy
vercel --prod

# Custom domain
vercel domains add esgnavigator.ai
```

**Alternative: AWS**
```
- Amplify for frontend
- API Gateway + Lambda for API
- RDS for PostgreSQL
- ElastiCache for Redis
- CloudFront for CDN
```

---

## Monitoring & Observability

### Application Monitoring

```yaml
# Shared across all domains
monitoring:
  apm: DataDog / New Relic
  logging: CloudWatch / Elasticsearch
  metrics: Prometheus + Grafana
  alerts: PagerDuty / Opsgenie

# Agent-specific monitoring
agent_monitoring:
  performance: Agent execution time
  quality: Output quality scores
  cost: Claude API usage per tenant
  errors: Agent failure rates
```

### Health Checks

```typescript
// Health check endpoints per domain
GET /api/health

// Response
{
  "status": "healthy",
  "domain": "Tis-Intelimat.net",
  "version": "1.2.3",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "agents": "healthy"
  },
  "timestamp": "2025-11-24T10:00:00Z"
}
```

---

## Security Considerations

### Cross-Domain Security

1. **Separate Authentication**
   - Each domain can have its own auth provider
   - Or use SSO with domain-based routing

2. **Data Isolation**
   - Holdings: Full access to all data
   - IntelliMat: Operations data only
   - Research: Training and R&D data
   - ESG Navigator: Tenant-isolated data

3. **API Security**
   - API keys per domain
   - Rate limiting per domain
   - CORS configuration

4. **Agent Security**
   - Agent actions require authorization
   - Audit logs for all agent operations
   - Sandboxed execution environment
   - Rate limiting on Claude API calls

---

## Cost Management

### Infrastructure Costs (Monthly Estimates)

```
TIS-Platform:
  - Server (DigitalOcean/AWS): $50-200
  - Database: $25-100
  - Storage: $10-50
  Total: $85-350/month

ESG Navigator:
  - Vercel Pro: $20/month
  - Database (Supabase/Vercel): $25-100/month
  - Claude API: Variable ($0.003/1K input tokens)
    - Estimate: R2,000-10,000/month based on usage
  - Storage: $10-50/month
  Total: $55-180 + Claude costs/month

Per 100 ESG assessments:
  - ~500K tokens avg
  - Cost: ~$1.50
```

### Claude API Cost Management

1. **Caching**: Cache common prompts and responses
2. **Batch Processing**: Group similar requests
3. **Tier-based Limits**: Limit API calls per subscription tier
4. **Monitoring**: Track usage per tenant
5. **Optimization**: Use smaller models where appropriate

---

## Migration Plan

### Phase 1: DNS and Domain Setup (Week 1-2)
- [ ] Configure Route 53 for IntelliMat ✅
- [ ] Point other domains to servers
- [ ] Set up SSL certificates for all domains
- [ ] Configure domain-specific branding

### Phase 2: Application Configuration (Week 3-4)
- [ ] Create environment files per domain
- [ ] Implement domain routing logic
- [ ] Test each domain independently
- [ ] Set up monitoring

### Phase 3: Agent Infrastructure (Month 2-3)
- [ ] Set up message queue (Redis)
- [ ] Implement agent manager
- [ ] Deploy first assessment agent
- [ ] Create agent monitoring dashboard

### Phase 4: Production Launch (Month 4)
- [ ] Load testing
- [ ] Security audit
- [ ] Backup and disaster recovery
- [ ] Go-live

---

## Support and Maintenance

### Domain Responsibilities

| Domain | Technical Lead | On-Call Rotation |
|--------|---------------|------------------|
| TIS Holdings | Infrastructure Team | Yes |
| IntelliMat | Operations Team | Yes |
| Research | R&D Team | Business hours |
| ESG Navigator | Product Team | 24/7 |

### SLA Targets

- **Holdings/IntelliMat**: 99.9% uptime (critical)
- **Research**: 99% uptime (important)
- **ESG Navigator**: 99.95% uptime (SaaS commitment)

---

*Configuration Version: 1.0*
*Last Updated: 2025-11-24*
