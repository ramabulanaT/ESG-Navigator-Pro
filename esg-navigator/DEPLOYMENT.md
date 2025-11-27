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

Complete production deployment using AWS ECS Fargate with Application Load Balancer and RDS PostgreSQL.

### Prerequisites
- AWS CLI installed and configured (`aws configure`)
- Docker installed locally
- AWS Account with appropriate permissions
- Domain name (optional, for production)

### Step 1: Set Environment Variables

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1
export PROJECT_NAME=esg-navigator
```

### Step 2: Setup AWS Infrastructure

Run the automated infrastructure setup script:

```bash
chmod +x infrastructure/setup-aws-infrastructure.sh
./infrastructure/setup-aws-infrastructure.sh
```

This creates:
- ✅ VPC with public subnets across 2 availability zones
- ✅ Internet Gateway and route tables
- ✅ Security groups (ALB, ECS tasks, RDS)
- ✅ ECR repositories for API and Web images
- ✅ ECS Cluster (Fargate)
- ✅ CloudWatch Log Groups
- ✅ RDS subnet group

**Manual Steps Required:**

#### Create RDS Database
```bash
# Source the generated config
source infrastructure/aws-config.env

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier ${PROJECT_NAME}-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username esgadmin \
  --master-user-password "YourSecurePassword123!" \
  --allocated-storage 20 \
  --db-subnet-group-name ${PROJECT_NAME}-db-subnet-group \
  --vpc-security-group-ids ${RDS_SG_ID} \
  --backup-retention-period 7 \
  --publicly-accessible false \
  --region ${AWS_REGION}

# Wait for DB to be available (5-10 minutes)
aws rds wait db-instance-available \
  --db-instance-identifier ${PROJECT_NAME}-db \
  --region ${AWS_REGION}

# Get DB endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier ${PROJECT_NAME}-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text \
  --region ${AWS_REGION})

echo "Database endpoint: $DB_ENDPOINT"
```

#### Store Secrets in AWS Secrets Manager
```bash
# Database URL
aws secretsmanager create-secret \
  --name esg-navigator/database-url \
  --secret-string "postgresql://esgadmin:YourSecurePassword123!@${DB_ENDPOINT}:5432/esgnavigator" \
  --region ${AWS_REGION}

# Anthropic API Key
aws secretsmanager create-secret \
  --name esg-navigator/anthropic-api-key \
  --secret-string "sk-ant-api03-your-actual-key-here" \
  --region ${AWS_REGION}

# JWT Secret
aws secretsmanager create-secret \
  --name esg-navigator/jwt-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region ${AWS_REGION}

# API URL (for frontend)
aws secretsmanager create-secret \
  --name esg-navigator/api-url \
  --secret-string "https://api.esgnavigator.ai" \
  --region ${AWS_REGION}
```

#### Create Application Load Balancer
```bash
# Create ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name ${PROJECT_NAME}-alb \
  --subnets ${SUBNET_IDS} \
  --security-groups ${ALB_SG_ID} \
  --region ${AWS_REGION} \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns ${ALB_ARN} \
  --query 'LoadBalancers[0].DNSName' \
  --output text \
  --region ${AWS_REGION})

echo "ALB DNS: $ALB_DNS"

# Create Target Group for API (port 8080)
API_TG_ARN=$(aws elbv2 create-target-group \
  --name ${PROJECT_NAME}-api-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id ${VPC_ID} \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region ${AWS_REGION} \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Create Target Group for Web (port 3000)
WEB_TG_ARN=$(aws elbv2 create-target-group \
  --name ${PROJECT_NAME}-web-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id ${VPC_ID} \
  --target-type ip \
  --health-check-path / \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region ${AWS_REGION} \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Create HTTP listener
aws elbv2 create-listener \
  --load-balancer-arn ${ALB_ARN} \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=${WEB_TG_ARN} \
  --region ${AWS_REGION}

# Add rule to forward /api/* to API target group
LISTENER_ARN=$(aws elbv2 describe-listeners \
  --load-balancer-arn ${ALB_ARN} \
  --query 'Listeners[0].ListenerArn' \
  --output text \
  --region ${AWS_REGION})

aws elbv2 create-rule \
  --listener-arn ${LISTENER_ARN} \
  --priority 1 \
  --conditions Field=path-pattern,Values='/api/*' \
  --actions Type=forward,TargetGroupArn=${API_TG_ARN} \
  --region ${AWS_REGION}
```

### Step 3: Register Task Definitions

Update the task definition files with your AWS Account ID:

```bash
# Update API task definition
sed -i "s/{AWS_ACCOUNT_ID}/${AWS_ACCOUNT_ID}/g" infrastructure/ecs-task-definition-api.json

# Update Web task definition
sed -i "s/{AWS_ACCOUNT_ID}/${AWS_ACCOUNT_ID}/g" infrastructure/ecs-task-definition-web.json

# Register task definitions
aws ecs register-task-definition \
  --cli-input-json file://infrastructure/ecs-task-definition-api.json \
  --region ${AWS_REGION}

aws ecs register-task-definition \
  --cli-input-json file://infrastructure/ecs-task-definition-web.json \
  --region ${AWS_REGION}
```

### Step 4: Create ECS Services

```bash
# Create API service
aws ecs create-service \
  --cluster ${PROJECT_NAME}-cluster \
  --service-name ${PROJECT_NAME}-api-service \
  --task-definition ${PROJECT_NAME}-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[${SUBNET_IDS}],securityGroups=[${ECS_SG_ID}],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=${API_TG_ARN},containerName=esg-navigator-api,containerPort=8080 \
  --health-check-grace-period-seconds 60 \
  --region ${AWS_REGION}

# Create Web service
aws ecs create-service \
  --cluster ${PROJECT_NAME}-cluster \
  --service-name ${PROJECT_NAME}-web-service \
  --task-definition ${PROJECT_NAME}-web \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[${SUBNET_IDS}],securityGroups=[${ECS_SG_ID}],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=${WEB_TG_ARN},containerName=esg-navigator-web,containerPort=3000 \
  --health-check-grace-period-seconds 60 \
  --region ${AWS_REGION}
```

### Step 5: Deploy Application

Build and push Docker images to ECR:

```bash
# Set environment variables
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1

# Run deployment script
./infrastructure/deploy-aws.sh
```

The script will:
1. Build API and Web Docker images
2. Authenticate with ECR
3. Tag and push images to ECR
4. Update ECS services with new images

### Step 6: Verify Deployment

Run the verification script:

```bash
# Set ALB DNS for endpoint testing
export ALB_DNS_NAME=$(aws elbv2 describe-load-balancers \
  --names ${PROJECT_NAME}-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text \
  --region ${AWS_REGION})

# Run verification
./infrastructure/verify-aws.sh
```

This checks:
- ✅ AWS credentials
- ✅ ECR repositories and images
- ✅ ECS cluster status
- ✅ ECS services health
- ✅ Task definitions
- ✅ CloudWatch logs
- ✅ Load balancer health
- ✅ Target groups
- ✅ VPC and networking
- ✅ Endpoint health

### Accessing the Application

- Frontend: `http://${ALB_DNS}` or `https://www.esgnavigator.ai`
- API: `http://${ALB_DNS}/api/health` or `https://www.esgnavigator.ai/api/health`

### Monitoring and Logs

```bash
# View ECS service status
aws ecs describe-services \
  --cluster ${PROJECT_NAME}-cluster \
  --services ${PROJECT_NAME}-api-service ${PROJECT_NAME}-web-service \
  --region ${AWS_REGION}

# View CloudWatch logs
aws logs tail /ecs/${PROJECT_NAME}-api --follow --region ${AWS_REGION}
aws logs tail /ecs/${PROJECT_NAME}-web --follow --region ${AWS_REGION}

# Check running tasks
aws ecs list-tasks --cluster ${PROJECT_NAME}-cluster --region ${AWS_REGION}
```

### Scaling

```bash
# Scale API service
aws ecs update-service \
  --cluster ${PROJECT_NAME}-cluster \
  --service ${PROJECT_NAME}-api-service \
  --desired-count 4 \
  --region ${AWS_REGION}

# Enable auto-scaling (optional)
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/${PROJECT_NAME}-cluster/${PROJECT_NAME}-api-service \
  --min-capacity 2 \
  --max-capacity 10 \
  --region ${AWS_REGION}
```

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
