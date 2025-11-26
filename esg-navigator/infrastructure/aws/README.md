# ESG Navigator AWS Infrastructure

This directory contains AWS CloudFormation templates and deployment scripts for deploying ESG Navigator to AWS.

## Architecture Overview

The infrastructure consists of:

- **VPC**: Multi-AZ setup with public, private, and database subnets
- **Application Load Balancer**: HTTPS termination, routing, and health checks
- **ECS Fargate**: Containerized API and Web services with auto-scaling
- **RDS PostgreSQL**: Managed database with encryption and backups
- **ElastiCache Redis**: In-memory caching layer
- **ECR**: Container registry for Docker images

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Internet                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Application Load Balancer                            │
│                    (HTTPS, SSL/TLS termination)                         │
└─────────────────────────────────────────────────────────────────────────┘
                          │                    │
                          ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           ECS Fargate                                    │
│    ┌─────────────────┐              ┌─────────────────┐                 │
│    │   API Service   │              │   Web Service   │                 │
│    │  (Express.js)   │◄────────────►│   (Next.js)     │                 │
│    │    Port 8080    │              │    Port 3000    │                 │
│    └────────┬────────┘              └─────────────────┘                 │
└─────────────┼───────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Private Subnets                                  │
│    ┌─────────────────┐              ┌─────────────────┐                 │
│    │ RDS PostgreSQL  │              │ ElastiCache     │                 │
│    │   (Primary)     │              │    Redis        │                 │
│    └─────────────────┘              └─────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
aws/
├── cloudformation/
│   ├── 01-vpc-network.yaml      # VPC, subnets, NAT gateway
│   ├── 02-security-groups.yaml  # Security groups for all services
│   ├── 03-database.yaml         # RDS PostgreSQL, ElastiCache Redis
│   ├── 04-ecr.yaml              # ECR repositories
│   ├── 05-alb.yaml              # Application Load Balancer
│   └── 06-ecs-cluster.yaml      # ECS cluster, services, auto-scaling
├── scripts/
│   ├── deploy-infrastructure.sh # Deploy all CloudFormation stacks
│   ├── build-and-push.sh        # Build and push Docker images to ECR
│   ├── deploy-services.sh       # Force new deployment of ECS services
│   └── parameters.env.example   # Example environment variables
└── README.md                    # This file
```

## Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **Docker** installed and running
3. **ACM Certificate** for your domain (create in AWS Certificate Manager)

### Required AWS Permissions

The deployment user/role needs permissions for:
- CloudFormation
- EC2 (VPC, Subnets, Security Groups)
- ECS (Clusters, Services, Task Definitions)
- ECR (Repositories)
- RDS (Instances, Subnet Groups)
- ElastiCache (Clusters, Subnet Groups)
- IAM (Roles, Policies)
- Secrets Manager
- SSM Parameter Store
- Application Load Balancing
- CloudWatch Logs
- Auto Scaling

## Deployment Steps

### 1. Create SSL Certificate

Before deployment, create an SSL certificate in AWS Certificate Manager:

```bash
aws acm request-certificate \
  --domain-name esgnavigator.ai \
  --subject-alternative-names "*.esgnavigator.ai" \
  --validation-method DNS \
  --region us-east-1
```

Validate the certificate by adding the CNAME record to your DNS.

### 2. Configure Parameters

```bash
cd infrastructure/aws/scripts
cp parameters.env.example parameters.env
# Edit parameters.env with your values
source parameters.env
```

### 3. Deploy Infrastructure

```bash
# Make scripts executable
chmod +x *.sh

# Deploy all CloudFormation stacks
./deploy-infrastructure.sh
```

This will deploy stacks in order:
1. VPC and Networking
2. Security Groups
3. Database (RDS + ElastiCache)
4. ECR Repositories
5. Application Load Balancer
6. ECS Cluster and Services

### 4. Build and Push Docker Images

```bash
./build-and-push.sh
```

Options:
- `--api-only`: Build only the API image
- `--web-only`: Build only the Web image
- `--tag TAG`: Use specific image tag

### 5. Deploy Services

```bash
./deploy-services.sh
```

Options:
- `--api-only`: Deploy only the API service
- `--web-only`: Deploy only the Web service
- `--no-wait`: Don't wait for services to stabilize

### 6. Configure DNS

Point your domain to the ALB DNS name:

```bash
# Get ALB DNS name
aws cloudformation describe-stacks \
  --stack-name production-esg-navigator-alb \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNSName`].OutputValue' \
  --output text
```

Create an A record (alias) in Route53 or a CNAME record in your DNS provider.

## Configuration Reference

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_REGION` | AWS region (default: us-east-1) | No |
| `ENVIRONMENT` | Environment name (production/staging/development) | No |
| `DB_PASSWORD` | Database master password | Yes |
| `CERTIFICATE_ARN` | ACM certificate ARN | Yes |
| `JWT_SECRET` | JWT signing secret (32+ chars) | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | Yes |
| `FRONTEND_URL` | Public frontend URL | No |
| `MULTI_AZ` | Enable Multi-AZ for RDS | No |
| `IMAGE_TAG` | Docker image tag | No |

### CloudFormation Parameters

Each template has its own parameters. Key ones include:

**Database (03-database.yaml)**
- `DBInstanceClass`: RDS instance type (default: db.t3.medium)
- `DBAllocatedStorage`: Storage in GB (default: 20)
- `CacheNodeType`: ElastiCache instance type (default: cache.t3.micro)

**ECS (06-ecs-cluster.yaml)**
- `APICpu`: CPU units for API (default: 512)
- `APIMemory`: Memory MB for API (default: 1024)
- `WebCpu`: CPU units for Web (default: 256)
- `WebMemory`: Memory MB for Web (default: 512)
- `APIDesiredCount`: Number of API tasks (default: 2)
- `WebDesiredCount`: Number of Web tasks (default: 2)

## Monitoring and Logs

### CloudWatch Logs

Logs are available in CloudWatch:
- API logs: `/ecs/${ENVIRONMENT}/esg-navigator-api`
- Web logs: `/ecs/${ENVIRONMENT}/esg-navigator-web`

### ECS Console

Monitor services in the ECS console or via CLI:

```bash
# List services
aws ecs list-services --cluster production-esg-navigator-cluster

# Describe services
aws ecs describe-services \
  --cluster production-esg-navigator-cluster \
  --services production-api-service production-web-service

# View running tasks
aws ecs list-tasks --cluster production-esg-navigator-cluster
```

### RDS Performance Insights

Performance Insights is enabled for the RDS instance. View metrics in the RDS console.

## Scaling

### Auto Scaling

Both API and Web services have auto-scaling configured:
- Target: 70% CPU utilization
- Min capacity: 2 tasks
- Max capacity: 10 tasks
- Scale out cooldown: 60 seconds
- Scale in cooldown: 300 seconds

### Manual Scaling

```bash
# Update desired count
aws ecs update-service \
  --cluster production-esg-navigator-cluster \
  --service production-api-service \
  --desired-count 4
```

## Troubleshooting

### Service Not Starting

1. Check task logs in CloudWatch
2. Verify security groups allow required traffic
3. Check task definition environment variables
4. Verify secrets in SSM Parameter Store

```bash
# View service events
aws ecs describe-services \
  --cluster production-esg-navigator-cluster \
  --services production-api-service \
  --query 'services[0].events[:5]'
```

### Database Connection Issues

1. Verify security group allows ECS tasks
2. Check DATABASE_URL secret in Secrets Manager
3. Test connectivity from within a task

```bash
# Connect to a running task
aws ecs execute-command \
  --cluster production-esg-navigator-cluster \
  --task <task-id> \
  --container api \
  --interactive \
  --command "/bin/sh"
```

### Health Check Failures

1. Verify health check endpoint is accessible
2. Check application logs for startup errors
3. Increase health check grace period if needed

## Cost Optimization

For development/staging environments:

1. Use `db.t3.micro` for RDS
2. Use `cache.t3.micro` for ElastiCache
3. Set `MultiAZ=false` for RDS
4. Reduce task counts to 1
5. Use Fargate Spot capacity provider

## Security Best Practices

1. Enable deletion protection on RDS (enabled by default)
2. Use Secrets Manager for database credentials
3. Use SSM Parameter Store for application secrets
4. Enable encryption at rest for RDS and ElastiCache
5. Keep security groups restrictive
6. Enable CloudWatch Container Insights
7. Regular security patching via auto minor version upgrades

## Cleanup

To delete all resources:

```bash
# Delete stacks in reverse order
aws cloudformation delete-stack --stack-name production-esg-navigator-ecs
aws cloudformation delete-stack --stack-name production-esg-navigator-alb
aws cloudformation delete-stack --stack-name production-esg-navigator-ecr
aws cloudformation delete-stack --stack-name production-esg-navigator-database
aws cloudformation delete-stack --stack-name production-esg-navigator-security-groups
aws cloudformation delete-stack --stack-name production-esg-navigator-vpc
```

Note: RDS has deletion protection enabled. Disable it first if you want to delete.
