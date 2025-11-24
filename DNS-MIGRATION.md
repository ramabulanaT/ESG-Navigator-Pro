# DNS Migration Guide: WordPress to ESG Navigator

This guide covers migrating from WordPress.com to ESG Navigator Pro while preserving your Titan email setup.

## Current Configuration (From WordPress)

### tis-holdings.com (Primary Domain)
Your primary domain with Titan email configured. **Email records must be preserved.**

| Type | Name | Current Value |
|------|------|---------------|
| A | @ | WordPress.com |
| CNAME | www | tis-holdings.com |
| MX | @ | mx1.titan.email (priority 10) |
| MX | @ | mx2.titan.email (priority 20) |
| TXT | @ | v=spf1 include:spf.titan.email ~all |
| TXT | _dmarc | v=DMARC1;p=none;sp=none;adkim=r;aspf=r;pct=100 |
| TXT | titan2._domainkey... | v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4G... |
| TXT | _domainconnect | public-api.wordpress.com/rest/v1.3/domain-connect |

### tisholdings.blog (Secondary Domain)
Basic WordPress setup, will redirect to primary.

| Type | Name | Current Value |
|------|------|---------------|
| A | @ | WordPress.com |
| CNAME | www | tisholdings.blog |
| MX | @ | WordPress.com email forwarding |
| TXT | _domainconnect | public-api.wordpress.com/rest/v1.3/domain-connect |

---

## Migration Steps

### Option A: Deploy to Vercel (Recommended)

#### Step 1: Deploy to Vercel
```bash
cd esg-navigator/apps/web
vercel --prod
```

#### Step 2: Add Domains in Vercel Dashboard
1. Go to Project Settings > Domains
2. Add `www.tis-holdings.com` (primary)
3. Add `tis-holdings.com` (redirect to www)
4. Add `tisholdings.blog` (redirect to www)
5. Add `www.tisholdings.blog` (redirect to www)

#### Step 3: Update DNS Records for tis-holdings.com

**KEEP these email records (do NOT delete):**
- MX records (mx1.titan.email, mx2.titan.email)
- TXT @ (SPF record for Titan)
- TXT _dmarc (DMARC record)
- TXT titan2._domainkey... (DKIM record)

**CHANGE these records:**

| Type | Name | New Value | Notes |
|------|------|-----------|-------|
| A | @ | 76.76.21.21 | Vercel IP |
| CNAME | www | cname.vercel-dns.com | Vercel CNAME |

**DELETE these records:**
- TXT _domainconnect (WordPress-specific)

#### Step 4: Update DNS Records for tisholdings.blog

**CHANGE all records:**

| Type | Name | New Value | Notes |
|------|------|-----------|-------|
| A | @ | 76.76.21.21 | Vercel IP |
| CNAME | www | cname.vercel-dns.com | Vercel CNAME |

**DELETE these records:**
- MX @ (WordPress email forwarding - no longer needed)
- TXT _domainconnect (WordPress-specific)

---

### Option B: Deploy to VPS with Docker

#### Step 1: Point DNS to Your VPS

Get your VPS IP address, then update:

**tis-holdings.com:**

| Type | Name | New Value |
|------|------|-----------|
| A | @ | YOUR_VPS_IP |
| A | www | YOUR_VPS_IP |

**tisholdings.blog:**

| Type | Name | New Value |
|------|------|-----------|
| A | @ | YOUR_VPS_IP |
| A | www | YOUR_VPS_IP |

#### Step 2: Get SSL Certificates

```bash
# On your VPS, run certbot for all domains
certbot certonly --webroot -w /var/www/certbot \
  -d www.tis-holdings.com \
  -d tis-holdings.com \
  -d tisholdings.blog \
  -d www.tisholdings.blog
```

#### Step 3: Deploy with Docker Compose

```bash
cd esg-navigator
docker-compose up -d
```

---

## DNS Propagation

DNS changes can take up to 48 hours to propagate globally. You can check propagation at:
- https://dnschecker.org
- https://www.whatsmydns.net

---

## Email Testing After Migration

After DNS changes propagate, verify Titan email still works:

1. Send a test email from your tis-holdings.com email
2. Receive a test email to your tis-holdings.com email
3. Check SPF/DKIM/DMARC with: https://mxtoolbox.com/SuperTool.aspx

---

## Rollback Plan

If issues occur, you can temporarily point back to WordPress:

**tis-holdings.com:**
| Type | Name | Value |
|------|------|-------|
| A | @ | WordPress.com IP |
| CNAME | www | tis-holdings.com |

Contact WordPress support for their current A record IP if needed.

---

## Summary Checklist

- [ ] Deploy ESG Navigator to Vercel or VPS
- [ ] Update A record for tis-holdings.com
- [ ] Update CNAME for www.tis-holdings.com
- [ ] Update A record for tisholdings.blog
- [ ] Update CNAME for www.tisholdings.blog
- [ ] Remove WordPress _domainconnect TXT records
- [ ] **DO NOT** delete MX, SPF, DKIM, or DMARC records for tis-holdings.com
- [ ] Test website loads on new hosting
- [ ] Test Titan email still works
- [ ] Detach domains from WordPress.com (after verification)
