# ESG Navigator - DNS Configuration Guide

This document provides complete DNS configuration instructions for all ESG Navigator domains and subdomains.

## Table of Contents

- [Overview](#overview)
- [DNS Records Required](#dns-records-required)
- [Production Setup](#production-setup)
- [Staging Setup](#staging-setup)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Verification Steps](#verification-steps)
- [Troubleshooting](#troubleshooting)

---

## Overview

The ESG Navigator platform uses a multi-domain architecture:

- **Primary Domain**: `esgnavigator.ai`
- **Main Application**: `www.esgnavigator.ai`
- **API Endpoint**: `api.esgnavigator.ai`
- **Alternative App Interface**: `app.esgnavigator.ai`
- **Staging Frontend**: `staging.esgnavigator.ai`
- **Staging API**: `staging-api.esgnavigator.ai`

---

## DNS Records Required

### Production Environment

Configure the following DNS records with your DNS provider (e.g., Cloudflare, Route53, GoDaddy):

#### A Records (IPv4)

```
Type    Name    Value               TTL     Priority
----    ----    -----               ---     --------
A       @       <YOUR_SERVER_IP>    3600    -
A       www     <YOUR_SERVER_IP>    3600    -
A       api     <YOUR_SERVER_IP>    3600    -
A       app     <YOUR_SERVER_IP>    3600    -
```

#### AAAA Records (IPv6) - Optional

```
Type    Name    Value               TTL     Priority
----    ----    -----               ---     --------
AAAA    @       <YOUR_IPv6>         3600    -
AAAA    www     <YOUR_IPv6>         3600    -
AAAA    api     <YOUR_IPv6>         3600    -
AAAA    app     <YOUR_IPv6>         3600    -
```

#### CNAME Records (If using CDN/Load Balancer)

If you're using a CDN (Cloudflare, CloudFront) or load balancer:

```
Type    Name    Value                           TTL     Priority
----    ----    -----                           ---     --------
CNAME   www     your-lb.cloudfront.net          3600    -
CNAME   api     your-api-lb.cloudfront.net      3600    -
CNAME   app     www.esgnavigator.ai             3600    -
```

**Note**: The apex domain (`@` or `esgnavigator.ai`) cannot be a CNAME. Use A/AAAA records or ALIAS records (if your DNS provider supports them).

#### CAA Records (SSL Certificate Authorization)

Restrict which Certificate Authorities can issue certificates:

```
Type    Name    Value                                   TTL
----    ----    -----                                   ---
CAA     @       0 issue "letsencrypt.org"              3600
CAA     @       0 issuewild "letsencrypt.org"          3600
CAA     @       0 iodef "mailto:security@tisholdings.co.za"  3600
```

---

### Staging Environment

#### A Records for Staging

```
Type    Name            Value                       TTL
----    ----            -----                       ---
A       staging         <STAGING_SERVER_IP>         3600
A       staging-api     <STAGING_SERVER_IP>         3600
```

#### Or CNAME Records (If using separate hosting)

```
Type    Name            Value                           TTL
----    ----            -----                           ---
CNAME   staging         staging.vercel.app              3600
CNAME   staging-api     staging-api.your-host.com       3600
```

---

## Production Setup

### Step 1: Configure DNS Provider

**For Cloudflare:**

1. Log into Cloudflare dashboard
2. Select your domain `esgnavigator.ai`
3. Navigate to DNS settings
4. Add the A records above
5. **Important**: Set Proxy Status:
   - ✅ **Proxied** (orange cloud) - for `www`, `api`, `app`
   - ❌ **DNS Only** (grey cloud) - for apex `@` (will redirect via middleware)

**For AWS Route53:**

1. Open Route53 console
2. Select your hosted zone for `esgnavigator.ai`
3. Create Record Sets for each subdomain
4. Use ALIAS records for apex domain if pointing to AWS resources

**For GoDaddy/Namecheap:**

1. Log into your DNS management panel
2. Navigate to DNS Management
3. Add A records as shown above
4. TTL: 3600 seconds (1 hour) or Auto

### Step 2: Configure Server IP

Replace `<YOUR_SERVER_IP>` with your actual server IP address:

```bash
# Find your server IP
curl -4 ifconfig.me    # IPv4
curl -6 ifconfig.me    # IPv6
```

### Step 3: Update DNS Records

Apply the DNS records using your provider's interface or API.

**Example using Cloudflare API:**

```bash
# Set your variables
ZONE_ID="your_zone_id"
API_TOKEN="your_api_token"
SERVER_IP="your.server.ip.address"

# Create www A record
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "www",
    "content": "'${SERVER_IP}'",
    "ttl": 3600,
    "proxied": true
  }'

# Repeat for api, app subdomains
```

---

## SSL Certificate Setup

### Option 1: Let's Encrypt (Certbot)

The project uses Let's Encrypt for SSL certificates via Certbot.

**Install Certbot:**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

**Generate Certificates:**

```bash
# Generate certificate for all domains
sudo certbot certonly --standalone \
  -d esgnavigator.ai \
  -d www.esgnavigator.ai \
  -d api.esgnavigator.ai \
  -d app.esgnavigator.ai \
  --email admin@tisholdings.co.za \
  --agree-tos \
  --no-eff-email

# Or use webroot method (if nginx is already running)
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d esgnavigator.ai \
  -d www.esgnavigator.ai \
  -d api.esgnavigator.ai \
  -d app.esgnavigator.ai
```

**Certificate Files Location:**

```
/etc/letsencrypt/live/esgnavigator.ai/fullchain.pem
/etc/letsencrypt/live/esgnavigator.ai/privkey.pem
```

**Copy to Project:**

```bash
# Copy certificates to project directory
sudo cp /etc/letsencrypt/live/esgnavigator.ai/fullchain.pem \
        ./esg-navigator/infrastructure/ssl/fullchain.pem

sudo cp /etc/letsencrypt/live/esgnavigator.ai/privkey.pem \
        ./esg-navigator/infrastructure/ssl/privkey.pem

# Set permissions
sudo chmod 644 ./esg-navigator/infrastructure/ssl/fullchain.pem
sudo chmod 600 ./esg-navigator/infrastructure/ssl/privkey.pem
```

**Auto-Renewal:**

```bash
# Test renewal
sudo certbot renew --dry-run

# Setup auto-renewal (cron job)
sudo crontab -e

# Add this line:
0 3 * * * certbot renew --post-hook "docker-compose -f /path/to/docker-compose.yml restart nginx"
```

### Option 2: Cloudflare SSL

If using Cloudflare with proxy enabled:

1. Go to Cloudflare Dashboard → SSL/TLS
2. Set SSL mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**
5. Download Cloudflare Origin Certificate
6. Install in your nginx configuration

### Option 3: Commercial Certificate

If you purchased an SSL certificate:

1. Generate CSR on your server
2. Submit CSR to your CA
3. Download certificate files
4. Install in nginx as shown in `nginx.conf`

---

## Verification Steps

### 1. DNS Propagation Check

Wait 5-10 minutes after DNS changes, then verify:

```bash
# Check A records
dig +short www.esgnavigator.ai
dig +short api.esgnavigator.ai
dig +short app.esgnavigator.ai

# Check from different locations
nslookup www.esgnavigator.ai 8.8.8.8  # Google DNS
nslookup www.esgnavigator.ai 1.1.1.1  # Cloudflare DNS
```

**Expected Output:**

```
www.esgnavigator.ai → YOUR_SERVER_IP
api.esgnavigator.ai → YOUR_SERVER_IP
app.esgnavigator.ai → YOUR_SERVER_IP
```

### 2. HTTPS Verification

```bash
# Test HTTPS connection
curl -I https://www.esgnavigator.ai
curl -I https://api.esgnavigator.ai
curl -I https://app.esgnavigator.ai

# Check SSL certificate
openssl s_client -connect www.esgnavigator.ai:443 -servername www.esgnavigator.ai
```

### 3. Redirect Verification

Test that redirects work correctly:

```bash
# Apex to www redirect (should return 301/308)
curl -I http://esgnavigator.ai

# HTTP to HTTPS redirect
curl -I http://www.esgnavigator.ai

# App subdomain redirect (should redirect to /dashboard)
curl -I https://app.esgnavigator.ai
```

### 4. API Health Check

```bash
# Test API endpoint
curl https://api.esgnavigator.ai/health

# Expected response:
# {"status":"ok","timestamp":"...","version":"..."}
```

### 5. Browser Testing

Open in browser and verify:

- ✅ https://esgnavigator.ai → redirects to https://www.esgnavigator.ai
- ✅ https://www.esgnavigator.ai → loads homepage
- ✅ https://api.esgnavigator.ai/health → returns JSON
- ✅ https://app.esgnavigator.ai → redirects to https://www.esgnavigator.ai/dashboard
- ✅ All pages show valid SSL certificate (🔒 icon)

---

## Troubleshooting

### Issue: DNS Not Resolving

**Symptoms:** `nslookup` or `dig` doesn't return your IP

**Solutions:**
1. Check DNS records are correctly entered in your provider
2. Wait for DNS propagation (up to 48 hours, usually 5-10 minutes)
3. Clear your local DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns

   # Linux
   sudo systemd-resolve --flush-caches
   ```
4. Test with external DNS checker: https://www.whatsmydns.net/

### Issue: SSL Certificate Errors

**Symptoms:** Browser shows "Not Secure" or certificate warnings

**Solutions:**
1. Verify certificate files exist and have correct permissions
2. Check certificate includes all subdomains (SAN)
3. Restart nginx: `docker-compose restart nginx`
4. Regenerate certificate with all domains:
   ```bash
   sudo certbot certonly --standalone -d esgnavigator.ai -d www.esgnavigator.ai -d api.esgnavigator.ai -d app.esgnavigator.ai
   ```

### Issue: Redirects Not Working

**Symptoms:** Apex domain doesn't redirect, or app subdomain doesn't redirect to dashboard

**Solutions:**
1. Check middleware.ts is deployed correctly
2. Verify nginx configuration is loaded:
   ```bash
   docker-compose exec nginx nginx -t
   docker-compose restart nginx
   ```
3. Clear browser cache or test in incognito mode
4. Check nginx logs:
   ```bash
   docker-compose logs nginx
   ```

### Issue: CORS Errors

**Symptoms:** API requests fail with CORS errors in browser console

**Solutions:**
1. Verify Origin header matches allowed domains
2. Check nginx CORS configuration in `nginx.conf`
3. Ensure middleware.ts CORS headers are set
4. Test with curl to isolate issue:
   ```bash
   curl -H "Origin: https://www.esgnavigator.ai" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS \
        https://api.esgnavigator.ai/some-endpoint
   ```

### Issue: API Not Accessible

**Symptoms:** `https://api.esgnavigator.ai` returns 502 Bad Gateway or timeout

**Solutions:**
1. Check API backend is running:
   ```bash
   docker-compose ps
   docker-compose logs api
   ```
2. Verify nginx can reach backend:
   ```bash
   docker-compose exec nginx curl http://api:8080/health
   ```
3. Check firewall rules allow port 443
4. Verify upstream configuration in nginx.conf

---

## DNS Configuration Checklist

Use this checklist to ensure everything is configured:

### Production

- [ ] A record for apex domain `@` → server IP
- [ ] A record for `www` → server IP
- [ ] A record for `api` → server IP
- [ ] A record for `app` → server IP
- [ ] CAA records configured for Let's Encrypt
- [ ] SSL certificates generated for all domains
- [ ] Certificates copied to project directory
- [ ] Auto-renewal configured for SSL
- [ ] DNS propagation verified
- [ ] HTTPS working on all domains
- [ ] Apex → www redirect working
- [ ] HTTP → HTTPS redirect working
- [ ] API health check accessible
- [ ] App subdomain redirect working

### Staging (When Ready)

- [ ] A/CNAME record for `staging`
- [ ] A/CNAME record for `staging-api`
- [ ] SSL certificates for staging domains
- [ ] Staging environment deployed
- [ ] Robots noindex configured

---

## Contact

For DNS and infrastructure questions:
- **Email**: admin@tisholdings.co.za
- **Support**: support@tisholdings.co.za

---

## References

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [Project Deployment Guide](./DEPLOYMENT.md)
