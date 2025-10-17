# 🚀 ESG Navigator - Production Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Domain: www.esgnavigator.ai
- SSL Certificate (Let's Encrypt or commercial)
- Cloud provider account (AWS/Azure/GCP)

---

## Option 1: Docker Compose Deployment (Recommended for VPS)

### 1. Clone Repository
```bash
git clone https://github.com/your-org/esg-navigator.git
cd esg-navigator
```

### 2. Configure Environment
```bash
# Create .env file
cp .env.example .env

# Edit with production values
nano .env
```

Required variables:
```env
DB_PASSWORD=your-secure-db-password
ANTHROPIC_API_KEY=sk-ant-api03-your-key
JWT_SECRET=your-32-char-secret
```

### 3. SSL Certificates
```bash
# Create SSL directory
mkdir -p infrastructure/ssl

# Copy your SSL certificates
cp /path/to/fullchain.pem infrastructure/ssl/
cp /path/to/privkey.pem infrastructure/ssl/
```

Or use Let's Encrypt:
```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d www.esgnavigator.ai -d esgnavigator.ai

# Copy to project
sudo cp /etc/letsencrypt/live/www.esgnavigator.ai/fullchain.pem infrastructure/ssl/
sudo cp /etc/letsencrypt/live/www.esgnavigator.ai/privkey.pem infrastructure/ssl/
```

### 4. Deploy
```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 5. Verify Deployment
- Frontend: https://www.esgnavigator.ai
- API Health: https://www.esgnavigator.ai/api/health
- Database: Check connection in logs

---

## Option 2: AWS ECS Deployment

### 1. Setup AWS Infrastructure
```bash
# Create ECR repositories
aws ecr create-repository --repository-name esg-navigator-api
aws ecr create-repository --repository-name esg-navigator-web

# Create ECS cluster
aws ecs create-cluster --cluster-name esg-navigator-cluster

# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier esg-navigator-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username esgadmin \
  --master-user-password YourSecurePassword \
  --allocated-storage 20
```

### 2. Deploy
```bash
chmod +x infrastructure/deploy-aws.sh
./infrastructure/deploy-aws.sh
```

### 3. Configure Load Balancer
- Create Application Load Balancer
- Add Target Groups for API (port 8080) and Web (port 3000)
- Configure SSL certificate
- Point www.esgnavigator.ai to ALB

---

## Option 3: Vercel (Frontend) + AWS Lambda (Backend)

### Frontend to Vercel
```bash
cd apps/web
vercel --prod
```

### Backend to AWS Lambda
```bash
# Install Serverless Framework
npm install -g serverless

# Deploy
cd apps/api
serverless deploy --stage production
```

---

## DNS Configuration

### A Records
```
www.esgnavigator.ai  →  Your-Server-IP
```

### CNAME Records (if using cloud)
```
www.esgnavigator.ai  →  your-lb.region.elb.amazonaws.com
```

---

## Post-Deployment Checklist

- [ ] SSL certificate valid
- [ ] Health check passing
- [ ] Login working
- [ ] Dashboard loading
- [ ] Claude AI responding
- [ ] Supplier data displaying
- [ ] Database connected
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Logs rotation configured

---

## Monitoring

### Health Checks
```bash
# API health
curl https://www.esgnavigator.ai/api/health

# Should return:
# {"status":"healthy","timestamp":"..."}
```

### Logs
```bash
# Docker logs
docker-compose logs -f api
docker-compose logs -f web

# Container stats
docker stats
```

---

## Backup Strategy

### Database Backups
```bash
# Daily automated backup
docker exec esg-postgres pg_dump -U esguser esgnavigator > backup-$(date +%Y%m%d).sql

# Restore
docker exec -i esg-postgres psql -U esguser esgnavigator < backup-20241016.sql
```

### Volume Backups
```bash
# Backup Docker volumes
docker run --rm -v esg-navigator_postgres-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /data
```

---

## Scaling

### Horizontal Scaling
```bash
# Scale API containers
docker-compose up -d --scale api=3

# Or in AWS ECS
aws ecs update-service --cluster esg-navigator-cluster \
  --service esg-navigator-api --desired-count 3
```

### Load Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API
ab -n 1000 -c 10 https://www.esgnavigator.ai/api/health
```

---

## Troubleshooting

### Container won't start
```bash
docker-compose logs api
docker-compose logs web
```

### Database connection issues
```bash
docker exec -it esg-postgres psql -U esguser esgnavigator
```

### SSL certificate issues
```bash
# Verify certificate
openssl x509 -in infrastructure/ssl/fullchain.pem -text -noout

# Test SSL
curl -vI https://www.esgnavigator.ai
```

---

## Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Update SSL Certificate
```bash
# Renew Let's Encrypt
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/www.esgnavigator.ai/fullchain.pem infrastructure/ssl/
sudo cp /etc/letsencrypt/live/www.esgnavigator.ai/privkey.pem infrastructure/ssl/

# Reload nginx
docker-compose exec nginx nginx -s reload
```

---

## Support

- Documentation: https://docs.esgnavigator.ai
- Email: support@tisholdings.co.za
- Phone: +27 XX XXX XXXX

---

**Built with ❤️ by TIS Holdings**
