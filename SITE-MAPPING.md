# ESG Navigator - Site Mapping & Architecture

This document provides a visual overview of how all ESG Navigator sites are mapped together and where traffic is routed.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ESG NAVIGATOR ECOSYSTEM                      │
│                     Domain: esgnavigator.ai                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Domain Hierarchy & Routing

### 1. Apex Domain → Primary Site

```
┌─────────────────────────┐
│   esgnavigator.ai       │  ──→  HTTP 308 Redirect
│   (Apex Domain)         │       ↓
└─────────────────────────┘       │
                                  │
┌─────────────────────────┐       │
│ www.esgnavigator.ai     │  ←────┘
│ (Primary Web Frontend)  │
│                         │
│ • Next.js Application   │
│ • Landing Page          │
│ • Assessments           │
│ • Dashboard             │
│ • User Portal           │
└─────────────────────────┘
```

**Configuration:**
- **Middleware**: `middleware.ts:42-47`
- **Nginx**: `nginx.conf:170-179`
- **Status**: 308 Permanent Redirect
- **SSL**: Enforced (HTTPS only)

---

### 2. API Subdomain → Backend Services

```
┌─────────────────────────┐
│  api.esgnavigator.ai    │
│  (API Backend)          │
│                         │
│ • Express.js REST API   │
│ • Authentication        │
│ • Database Access       │
│ • Business Logic        │
│ • WebSocket Support     │
└─────────────────────────┘
         ↑
         │
         │ API Calls
         │
┌─────────────────────────┐
│ www.esgnavigator.ai     │
│ (Frontend)              │
└─────────────────────────┘
```

**Configuration:**
- **Nginx**: `nginx.conf:181-237`
- **Port**: 443 (HTTPS) → 8080 (Internal)
- **CORS**: Enabled for all ESG Navigator domains
- **Rate Limiting**: 100 req/min
- **Endpoints**:
  - `GET /health` - Health check
  - `POST /api/auth/*` - Authentication
  - `GET/POST /api/assessments/*` - Assessments
  - `GET/POST /api/suppliers/*` - Supplier data
  - `WebSocket /realtime` - Real-time updates

---

### 3. App Subdomain → Dashboard

```
┌─────────────────────────┐
│ app.esgnavigator.ai     │  ──→  HTTP 302 Redirect
│ (Alternative Interface) │       ↓
└─────────────────────────┘       │
                                  │
┌─────────────────────────┐       │
│ www.esgnavigator.ai     │  ←────┘
│      /dashboard         │
│                         │
│ • User Dashboard        │
│ • Assessment Tools      │
│ • Analytics             │
└─────────────────────────┘
```

**Configuration:**
- **Middleware**: `middleware.ts:53-60`
- **Nginx**: `nginx.conf:274-283`
- **Status**: 302 Temporary Redirect
- **Purpose**: Provides friendly alternative URL for accessing dashboard
- **Future**: Can be reconfigured to host TIS-Platform separately

**Alternative Configuration (TIS-Platform):**
```
┌─────────────────────────┐
│ app.esgnavigator.ai     │ ──→ Separate Deployment
│ (TIS-Platform)          │
│                         │
│ • Simplified Interface  │
│ • 10-Question Form      │
│ • Lite Assessment       │
└─────────────────────────┘
```
To enable: Uncomment `nginx.conf:242-271`

---

### 4. Staging Environments (Not Yet Deployed)

```
┌────────────────────────────────────────────────────────────┐
│                    STAGING ENVIRONMENT                      │
└────────────────────────────────────────────────────────────┘

┌─────────────────────────┐       ┌─────────────────────────┐
│ staging.esgnavigator.ai │       │ staging-api.esg...ai    │
│ (Staging Frontend)      │  ←──→ │ (Staging API)           │
│                         │       │                         │
│ • Pre-production tests  │       │ • API Testing           │
│ • QA Environment        │       │ • Integration Tests     │
│ • No Search Indexing    │       │ • No Search Indexing    │
└─────────────────────────┘       └─────────────────────────┘
```

**Configuration:**
- **Nginx**: `nginx.conf:285-353` (Commented out)
- **Environment Variables**: Configured in `ESG-Complete.ps1`
- **Status**: Placeholder (uncomment when ready to deploy)
- **Security**: `X-Robots-Tag: noindex, nofollow`

---

## Traffic Flow Diagram

### Production Traffic Flow

```
┌─────────────┐
│   Internet  │
│    Users    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│        Nginx Reverse Proxy          │
│        Port 443 (HTTPS)             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  SSL Termination            │   │
│  │  Let's Encrypt Certificates │   │
│  └─────────────────────────────┘   │
└──────────┬──────────┬───────────────┘
           │          │
           │          └─────────────────┐
           │                            │
           ↓                            ↓
┌──────────────────────┐    ┌──────────────────────┐
│   Web Frontend       │    │   API Backend        │
│   (Next.js)          │    │   (Express.js)       │
│   Port 3000          │    │   Port 8080          │
│                      │    │                      │
│ • Server-Side        │    │ • REST Endpoints     │
│   Rendering          │    │ • Database Access    │
│ • Static Pages       │    │ • Business Logic     │
│ • Client Hydration   │    │ • Authentication     │
└──────────┬───────────┘    └───────────┬──────────┘
           │                            │
           └────────────┬───────────────┘
                        │
                        ↓
           ┌─────────────────────┐
           │    PostgreSQL       │
           │    Port 5432        │
           │                     │
           │  • User Data        │
           │  • Assessments      │
           │  • Supplier Info    │
           └─────────────────────┘
```

---

## Redirect Mapping Table

| From URL | To URL | Status | Where Handled | Config File |
|----------|--------|--------|---------------|-------------|
| `http://esgnavigator.ai/*` | `https://www.esgnavigator.ai/*` | 301 | Nginx | `nginx.conf:50-64` |
| `https://esgnavigator.ai/*` | `https://www.esgnavigator.ai/*` | 308 | Middleware | `middleware.ts:42-47` |
| `http://www.esgnavigator.ai/*` | `https://www.esgnavigator.ai/*` | 301 | Nginx | `nginx.conf:50-64` |
| `https://app.esgnavigator.ai/*` | `https://www.esgnavigator.ai/dashboard/*` | 302 | Middleware + Nginx | `middleware.ts:53-60` |
| `https://www.esgnavigator.ai/api/*.js` | `https://www.esgnavigator.ai/api/*` | 308 | Middleware | `middleware.ts:66-71` |
| `https://www.esgnavigator.ai/*/` | `https://www.esgnavigator.ai/*` | 308 | Middleware | `middleware.ts:73-78` |

**Status Code Meanings:**
- **301**: Permanent redirect (cached by browsers)
- **302**: Temporary redirect (not cached)
- **308**: Permanent redirect (preserves request method, not cached aggressively)

---

## CORS & Cross-Domain Communication

### Allowed Origins

All subdomains can communicate with each other via CORS:

```javascript
VALID_HOSTS = [
  "www.esgnavigator.ai",
  "api.esgnavigator.ai",
  "app.esgnavigator.ai",
  "staging.esgnavigator.ai",
  "staging-api.esgnavigator.ai"
]
```

**Configuration**: `middleware.ts:8-14`, `nginx.conf:101-110`, `nginx.conf:204-214`

### API Communication Flow

```
┌─────────────────────────┐
│  www.esgnavigator.ai    │
│  (Browser Client)       │
└───────────┬─────────────┘
            │
            │ 1. API Request
            │    Origin: www.esgnavigator.ai
            │    Authorization: Bearer <token>
            ↓
┌─────────────────────────┐
│  www.esgnavigator.ai    │
│  /api/* (Proxy)         │
└───────────┬─────────────┘
            │
            │ 2. Proxied to Backend
            │    X-Forwarded-Host: www.esgnavigator.ai
            ↓
┌─────────────────────────┐
│  api:8080               │
│  (Internal Backend)     │
└───────────┬─────────────┘
            │
            │ 3. Response
            │    Access-Control-Allow-Origin: www.esgnavigator.ai
            ↓
┌─────────────────────────┐
│  Browser Client         │
│  (Receives Response)    │
└─────────────────────────┘
```

**Direct API Access** (from external clients):

```
┌─────────────────────────┐
│  External Client        │
│  (Postman, cURL, etc)   │
└───────────┬─────────────┘
            │
            │ Direct API Request
            │ Host: api.esgnavigator.ai
            │ Authorization: Bearer <token>
            ↓
┌─────────────────────────┐
│  api.esgnavigator.ai    │
│  (Nginx → Backend)      │
└───────────┬─────────────┘
            │
            │ Response
            ↓
┌─────────────────────────┐
│  External Client        │
│  (Receives JSON)        │
└─────────────────────────┘
```

---

## Deployment Configurations

### Docker Compose (Production)

```yaml
services:
  nginx:
    - Listens on ports 80, 443
    - Handles SSL termination
    - Routes to web:3000 and api:8080

  web:
    - Next.js frontend
    - Internal port 3000
    - Environment: NEXT_PUBLIC_API_URL=https://www.esgnavigator.ai

  api:
    - Express.js backend
    - Internal port 8080
    - Environment: API_BACKEND_URL=https://api.esgnavigator.ai

  postgres:
    - Database
    - Port 5432 (internal only)

  redis:
    - Cache & sessions
    - Port 6379 (internal only)
```

**File**: `docker-compose.yml`

### Vercel Deployment (Alternative)

```json
{
  "name": "esg-navigator-pro",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.esgnavigator.ai/:path*" }
  ]
}
```

**File**: `vercel.json`

---

## Security Configuration

### Rate Limiting

| Endpoint | Rate Limit | Burst | Config Location |
|----------|------------|-------|-----------------|
| `/api/*` | 100 req/min | 20 | `nginx.conf:36,217` |
| `/api/auth/login` | 5 req/min | 3 | `nginx.conf:37,112` |

### Security Headers (All Responses)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**Configuration**: `middleware.ts:98-102`, `nginx.conf:79-85`

### Blocked Paths

The following paths return 404:
- `/.env*` - Environment files
- `/.git*` - Git repository
- `/node_modules/` - Dependencies
- `/.next/` - Build artifacts
- `/config/` - Configuration files

**Configuration**: `middleware.ts:80-91`

---

## Environment-Specific Behavior

### Production (`VERCEL_ENV=production`)

- ✅ HTTPS enforced
- ✅ HSTS enabled
- ✅ Search engine indexing allowed
- ✅ Full rate limiting
- ✅ Production API endpoints

### Staging/Preview

- ✅ HTTPS enforced
- ✅ HSTS enabled
- ❌ Search engine indexing blocked (`X-Robots-Tag: noindex, nofollow`)
- ✅ Full rate limiting
- ✅ Staging API endpoints

### Development (`localhost`)

- ❌ HTTP allowed
- ❌ HSTS disabled
- ❌ Search engine indexing blocked
- ⚠️  Reduced rate limiting
- ⚠️  Local API endpoints (`http://localhost:5050`)

---

## Quick Reference

### DNS Records Summary

```
esgnavigator.ai          → <SERVER_IP>    (A)
www.esgnavigator.ai      → <SERVER_IP>    (A)
api.esgnavigator.ai      → <SERVER_IP>    (A)
app.esgnavigator.ai      → <SERVER_IP>    (A)
staging.esgnavigator.ai  → <SERVER_IP>    (A) [Future]
staging-api.esgnavigator → <SERVER_IP>    (A) [Future]
```

### Port Mapping

```
External:
  80  → Nginx (HTTP, redirects to 443)
  443 → Nginx (HTTPS, SSL termination)

Internal (Docker Network):
  3000 → Next.js Web Frontend
  8080 → Express.js API Backend
  5432 → PostgreSQL Database
  6379 → Redis Cache
```

### Key Configuration Files

| File | Purpose |
|------|---------|
| `/_redirects` | Platform-agnostic redirect rules |
| `/vercel.json` | Vercel-specific configuration |
| `/middleware.ts` | Next.js edge middleware (redirects, headers) |
| `/esg-navigator/infrastructure/nginx.conf` | Nginx reverse proxy config |
| `/esg-navigator/apps/web/.env.production` | Production environment variables |
| `/DNS-CONFIGURATION.md` | Complete DNS setup guide |

---

## Testing Commands

```bash
# Test redirects
curl -I http://esgnavigator.ai
curl -I https://esgnavigator.ai
curl -I https://app.esgnavigator.ai

# Test API
curl https://api.esgnavigator.ai/health

# Test CORS
curl -H "Origin: https://www.esgnavigator.ai" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.esgnavigator.ai/api/auth/login

# Check DNS
dig +short www.esgnavigator.ai
dig +short api.esgnavigator.ai

# Test SSL
openssl s_client -connect www.esgnavigator.ai:443 -servername www.esgnavigator.ai
```

---

## Next Steps

1. ✅ **Completed**: Site mapping and redirect configuration
2. ✅ **Completed**: Nginx subdomain configuration
3. ✅ **Completed**: Middleware redirect rules
4. ⏳ **Pending**: Configure DNS records (see `DNS-CONFIGURATION.md`)
5. ⏳ **Pending**: Generate SSL certificates
6. ⏳ **Pending**: Deploy staging environment
7. ⏳ **Pending**: Test all redirects and CORS
8. ⏳ **Pending**: Load test rate limiting

---

## Support

For questions about site mapping and architecture:
- **Technical Lead**: admin@tisholdings.co.za
- **Support**: support@tisholdings.co.za
- **Sales**: sales@esgnavigator.ai

---

**Last Updated**: 2025-11-25
**Version**: 1.0.0
