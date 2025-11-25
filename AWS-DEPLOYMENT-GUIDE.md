# AWS Deployment Guide - ESG Navigator Agent System v2

> **Complete AWS deployment for production-grade ESG Navigator**

---

## 🏗️ AWS Architecture

```
Internet
    ↓
┌─────────────────────────────────────────────────┐
│  Route 53 (DNS)                                  │
│  api.esgnavigator.ai                            │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  CloudFront (CDN + SSL)                         │
│  - Global edge caching                           │
│  - DDoS protection                               │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  Application Load Balancer (ALB)                │
│  - SSL termination                               │
│  - Health checks                                 │
└─────────────────┬───────────────────────────────┘
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
┌──────────────┐    ┌──────────────┐
│  ECS Fargate │    │  ECS Fargate │
│  Task 1      │    │  Task 2      │
│  (API)       │    │  (API)       │
└──────┬───────┘    └──────┬───────┘
       │                   │
       └─────────┬─────────┘
                 ↓
    ┌────────────┴────────────┐
    │                         │
    ↓                         ↓
┌──────────────┐      ┌──────────────┐
│ RDS          │      │ ElastiCache  │
│ PostgreSQL   │      │ Redis        │
│ (Multi-AZ)   │      │ (Agent cache)│
└──────────────┘      └──────────────┘
```

---

## 🚀 Quick Deploy with AWS CDK

### Prerequisites

```bash
# 1. Install AWS CDK
npm install -g aws-cdk

# 2. Configure AWS credentials
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1 (or your preferred region)

# 3. Verify credentials
aws sts get-caller-identity
```

### Step 1: Create CDK Infrastructure

```bash
# Create infrastructure directory
mkdir -p infrastructure/aws-cdk
cd infrastructure/aws-cdk

# Initialize CDK project
cdk init app --language typescript

# Install dependencies
npm install @aws-cdk/aws-ec2 @aws-cdk/aws-ecs @aws-cdk/aws-ecs-patterns \
  @aws-cdk/aws-rds @aws-cdk/aws-elasticache @aws-cdk/aws-secretsmanager \
  @aws-cdk/aws-logs @aws-cdk/aws-iam @aws-cdk/aws-certificatemanager \
  @aws-cdk/aws-route53 @aws-cdk/aws-route53-targets
```

### Step 2: CDK Stack Definition

Create `lib/esg-navigator-stack.ts`:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export class ESGNavigatorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ========================================
    // 1. VPC - Network Foundation
    // ========================================
    const vpc = new ec2.Vpc(this, 'ESGNavigatorVPC', {
      maxAzs: 2, // Multi-AZ for high availability
      natGateways: 1, // Cost optimization (use 2 for production HA)
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // ========================================
    // 2. Secrets Manager - API Keys
    // ========================================
    const anthropicApiKey = new secretsmanager.Secret(
      this,
      'AnthropicAPIKey',
      {
        secretName: 'esg-navigator/anthropic-api-key',
        description: 'Anthropic Claude API key for ESG agents',
        generateSecretString: {
          secretStringTemplate: JSON.stringify({ apiKey: '' }),
          generateStringKey: 'password',
        },
      }
    );

    const jwtSecret = new secretsmanager.Secret(this, 'JWTSecret', {
      secretName: 'esg-navigator/jwt-secret',
      description: 'JWT secret for authentication',
      generateSecretString: {
        excludePunctuation: true,
        passwordLength: 64,
      },
    });

    // ========================================
    // 3. RDS PostgreSQL - Database
    // ========================================
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for RDS PostgreSQL',
      allowAllOutbound: true,
    });

    const database = new rds.DatabaseInstance(this, 'ESGDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_4,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO // Upgrade to SMALL/MEDIUM for production
      ),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [dbSecurityGroup],
      multiAz: true, // High availability
      allocatedStorage: 20,
      maxAllocatedStorage: 100, // Auto-scaling storage
      storageEncrypted: true,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: true, // Prevent accidental deletion
      databaseName: 'esgnavigator',
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
    });

    // ========================================
    // 4. ElastiCache Redis - Agent Caching
    // ========================================
    const redisSecurityGroup = new ec2.SecurityGroup(
      this,
      'RedisSecurityGroup',
      {
        vpc,
        description: 'Security group for ElastiCache Redis',
        allowAllOutbound: true,
      }
    );

    const redisSubnetGroup = new elasticache.CfnSubnetGroup(
      this,
      'RedisSubnetGroup',
      {
        description: 'Subnet group for Redis',
        subnetIds: vpc.selectSubnets({
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        }).subnetIds,
      }
    );

    const redis = new elasticache.CfnCacheCluster(this, 'ESGRedisCache', {
      cacheNodeType: 'cache.t3.micro', // Upgrade to t3.small for production
      engine: 'redis',
      numCacheNodes: 1,
      port: 6379,
      vpcSecurityGroupIds: [redisSecurityGroup.securityGroupId],
      cacheSubnetGroupName: redisSubnetGroup.ref,
      engineVersion: '7.0',
    });

    // ========================================
    // 5. ECS Cluster - Container Orchestration
    // ========================================
    const cluster = new ecs.Cluster(this, 'ESGCluster', {
      vpc,
      clusterName: 'esg-navigator-cluster',
      containerInsights: true, // Enable CloudWatch Container Insights
    });

    // ========================================
    // 6. Task Definition - Container Config
    // ========================================
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'ESGTaskDef',
      {
        memoryLimitMiB: 1024, // 1GB RAM (adjust based on load)
        cpu: 512, // 0.5 vCPU (adjust based on load)
      }
    );

    // Log Group
    const logGroup = new logs.LogGroup(this, 'ESGLogGroup', {
      logGroupName: '/ecs/esg-navigator',
      retention: logs.RetentionDays.ONE_WEEK, // Adjust as needed
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Container Definition
    const container = taskDefinition.addContainer('api', {
      image: ecs.ContainerImage.fromRegistry(
        // Replace with your ECR repository
        'YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/esg-navigator:latest'
      ),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'esg-api',
        logGroup,
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: '5050',
        DATABASE_URL: `postgresql://postgres:${database.secret?.secretValueFromJson('password')}@${database.dbInstanceEndpointAddress}:5432/esgnavigator`,
        REDIS_URL: `redis://${redis.attrRedisEndpointAddress}:${redis.attrRedisEndpointPort}`,
        ANTHROPIC_MODEL: 'claude-3-5-sonnet-20241022',
        ANTHROPIC_MAX_TOKENS: '4096',
        LOG_LEVEL: 'info',
        API_VERSION: 'v2',
      },
      secrets: {
        ANTHROPIC_API_KEY: ecs.Secret.fromSecretsManager(
          anthropicApiKey,
          'apiKey'
        ),
        JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
      },
    });

    container.addPortMappings({
      containerPort: 5050,
      protocol: ecs.Protocol.TCP,
    });

    // Allow ECS tasks to access RDS
    database.connections.allowFrom(
      taskDefinition.connections,
      ec2.Port.tcp(5432)
    );

    // Allow ECS tasks to access Redis
    redisSecurityGroup.addIngressRule(
      taskDefinition.connections.securityGroups[0],
      ec2.Port.tcp(6379),
      'Allow ECS tasks to Redis'
    );

    // ========================================
    // 7. ALB + Fargate Service
    // ========================================
    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'ESGFargateService',
      {
        cluster,
        taskDefinition,
        desiredCount: 2, // Run 2 tasks for HA
        publicLoadBalancer: true,
        listenerPort: 443, // HTTPS
        certificate: undefined, // Add ACM certificate for custom domain
        healthCheckGracePeriod: cdk.Duration.seconds(60),
      }
    );

    // Configure health check
    fargateService.targetGroup.configureHealthCheck({
      path: '/health',
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
    });

    // Auto-scaling
    const scaling = fargateService.service.autoScaleTaskCount({
      minCapacity: 2,
      maxCapacity: 10,
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    // ========================================
    // 8. Outputs
    // ========================================
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
      description: 'DNS name of the load balancer',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.dbInstanceEndpointAddress,
      description: 'RDS database endpoint',
    });

    new cdk.CfnOutput(this, 'RedisEndpoint', {
      value: redis.attrRedisEndpointAddress,
      description: 'Redis cache endpoint',
    });

    new cdk.CfnOutput(this, 'AnthropicSecretArn', {
      value: anthropicApiKey.secretArn,
      description: 'ARN of Anthropic API key secret',
    });
  }
}
```

### Step 3: Build and Push Docker Image to ECR

```bash
# 1. Create ECR repository
aws ecr create-repository --repository-name esg-navigator

# 2. Get login credentials
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# 3. Build Docker image
cd /home/user/ESG-Navigator-Pro/esg-navigator/apps/api

# Create Dockerfile if not exists
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5050

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5050/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
EOF

# 4. Build and tag
docker build -t esg-navigator .
docker tag esg-navigator:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/esg-navigator:latest

# 5. Push to ECR
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/esg-navigator:latest
```

### Step 4: Deploy with CDK

```bash
cd infrastructure/aws-cdk

# Bootstrap CDK (first time only)
cdk bootstrap aws://YOUR_AWS_ACCOUNT_ID/us-east-1

# Synthesize CloudFormation template
cdk synth

# Deploy
cdk deploy

# Confirm: "Do you wish to deploy these changes (y/n)?" -> y
```

### Step 5: Update Secrets in AWS Secrets Manager

```bash
# Update Anthropic API key
aws secretsmanager put-secret-value \
  --secret-id esg-navigator/anthropic-api-key \
  --secret-string '{"apiKey":"sk-ant-api03-your-actual-key-here"}'

# JWT secret is auto-generated, no action needed
```

### Step 6: Verify Deployment

```bash
# Get Load Balancer URL from CDK output
export LB_URL="your-alb-url-here.us-east-1.elb.amazonaws.com"

# Test health check
curl http://$LB_URL/health

# Test authentication
curl -X POST http://$LB_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@tisholdings.co.za", "password": "admin123"}'

# Test agents
curl http://$LB_URL/api/agents/v2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🌐 Custom Domain Setup

### Step 1: Request SSL Certificate

```bash
# Request certificate in ACM
aws acm request-certificate \
  --domain-name api.esgnavigator.ai \
  --validation-method DNS \
  --region us-east-1

# Note the CertificateArn from output
```

### Step 2: Validate Certificate

1. Go to AWS Console → Certificate Manager
2. Click on the certificate
3. Click "Create records in Route 53" (if using Route 53)
4. Wait for validation (5-30 minutes)

### Step 3: Update CDK Stack

Add to your stack:

```typescript
// Import existing hosted zone
const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
  domainName: 'esgnavigator.ai',
});

// Import certificate
const certificate = acm.Certificate.fromCertificateArn(
  this,
  'Certificate',
  'arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID'
);

// Update Fargate service to use certificate
const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
  this,
  'ESGFargateService',
  {
    cluster,
    taskDefinition,
    desiredCount: 2,
    publicLoadBalancer: true,
    certificate: certificate, // Add this
    domainName: 'api.esgnavigator.ai', // Add this
    domainZone: hostedZone, // Add this
  }
);
```

### Step 4: Redeploy

```bash
cdk deploy
```

Now your API is available at: `https://api.esgnavigator.ai`

---

## 📊 Monitoring & Observability

### CloudWatch Dashboards

```bash
# Create custom dashboard
aws cloudwatch put-dashboard \
  --dashboard-name ESGNavigatorMetrics \
  --dashboard-body file://dashboard.json
```

**dashboard.json:**
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", {"stat": "Average"}],
          [".", "MemoryUtilization", {"stat": "Average"}]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "ECS Metrics"
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ApplicationELB", "TargetResponseTime", {"stat": "Average"}],
          [".", "RequestCount", {"stat": "Sum"}]
        ],
        "period": 300,
        "region": "us-east-1",
        "title": "ALB Metrics"
      }
    }
  ]
}
```

### CloudWatch Alarms

```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name esg-navigator-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:YOUR_ACCOUNT:alerts

# High memory alarm
aws cloudwatch put-metric-alarm \
  --alarm-name esg-navigator-high-memory \
  --alarm-description "Alert when memory exceeds 85%" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:YOUR_ACCOUNT:alerts
```

### Log Insights Queries

```bash
# View agent execution logs
fields @timestamp, @message
| filter @message like /AgentExecution/
| sort @timestamp desc
| limit 100

# Find errors
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 50

# Track token usage
fields @timestamp, tokensUsed, tenant
| filter @message like /tokensUsed/
| stats sum(tokensUsed) by tenant
```

---

## 💰 Cost Estimation

### Monthly AWS Costs

| Service | Configuration | Est. Cost |
|---------|--------------|-----------|
| **ECS Fargate** | 2 tasks, 0.5 vCPU, 1GB RAM | $30 |
| **ALB** | 1 load balancer | $23 |
| **RDS PostgreSQL** | db.t3.micro, Multi-AZ | $30 |
| **ElastiCache Redis** | cache.t3.micro | $15 |
| **NAT Gateway** | 1 gateway | $32 |
| **Data Transfer** | ~100GB/month | $9 |
| **CloudWatch Logs** | 10GB/month | $5 |
| **Secrets Manager** | 2 secrets | $1 |
| **Route 53** | 1 hosted zone | $0.50 |
| **ACM Certificate** | SSL/TLS | Free |
| **Total (Infrastructure)** | | **~$145/month** |
| **+ Claude API** | ~1000 assessments | **~$1,500** |
| **Grand Total** | | **~$1,645/month** |

### Cost Optimization Tips

1. **Use Savings Plans** - 40% discount on ECS/Fargate
2. **Right-size instances** - Start small, scale based on metrics
3. **Enable caching** - Reduce Claude API calls
4. **Use Spot instances** - For non-critical tasks (70% savings)
5. **Optimize logs** - Reduce retention period
6. **Reserved RDS** - 40-60% discount for 1-3 year commit

---

## 🔒 Security Best Practices

### IAM Roles

```bash
# ECS Task Execution Role (already created by CDK)
# ECS Task Role (for application permissions)

# Grant minimal permissions
aws iam create-policy --policy-name ESGTaskPolicy --policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:*:secret:esg-navigator/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:us-east-1:*:log-group:/ecs/esg-navigator:*"
    }
  ]
}'
```

### Security Groups

```bash
# Restrict database access to ECS only
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-ecs-tasks

# Restrict Redis access to ECS only
aws ec2 authorize-security-group-ingress \
  --group-id sg-yyyyy \
  --protocol tcp \
  --port 6379 \
  --source-group sg-ecs-tasks
```

### Enable AWS WAF

```bash
# Protect ALB with WAF
aws wafv2 create-web-acl \
  --name esg-navigator-waf \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: esg-navigator

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd esg-navigator/apps/api
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster esg-navigator-cluster \
            --service ESGFargateService \
            --force-new-deployment
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] AWS account created and configured
- [ ] Anthropic API key obtained
- [ ] Docker image built and tested locally
- [ ] CDK stack reviewed and customized
- [ ] Secrets prepared for Secrets Manager

### Deployment
- [ ] ECR repository created
- [ ] Docker image pushed to ECR
- [ ] CDK stack deployed successfully
- [ ] Secrets updated in Secrets Manager
- [ ] Health check passing
- [ ] SSL certificate validated

### Post-Deployment
- [ ] Custom domain configured
- [ ] CloudWatch alarms set up
- [ ] Backup strategy configured
- [ ] Monitoring dashboard created
- [ ] CI/CD pipeline configured
- [ ] Documentation updated with endpoints

---

## 🆘 Troubleshooting

### ECS Tasks Not Starting

```bash
# Check task logs
aws logs tail /ecs/esg-navigator --follow

# Check task failures
aws ecs describe-tasks --cluster esg-navigator-cluster --tasks TASK_ID
```

### Database Connection Issues

```bash
# Test from ECS task
aws ecs execute-command --cluster esg-navigator-cluster \
  --task TASK_ID \
  --container api \
  --interactive \
  --command "/bin/sh"

# Inside container:
nc -zv DATABASE_ENDPOINT 5432
```

### High Costs

```bash
# Review CloudWatch usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 86400 \
  --statistics Average
```

---

## 📞 Support

**AWS Support Plans:**
- Developer: $29/month (12-hour response)
- Business: $100/month (1-hour response)
- Enterprise: $15,000/month (15-min response)

**Community:**
- AWS Forums: https://forums.aws.amazon.com
- Stack Overflow: aws-cdk, aws-ecs tags

---

**Your ESG Navigator is now production-ready on AWS!** 🎉

Next: Configure monitoring, set up CI/CD, and start onboarding clients.
