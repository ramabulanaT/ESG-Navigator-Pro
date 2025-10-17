#!/bin/bash
# AWS ECS Deployment Script

echo "🚀 Deploying ESG Navigator to AWS..."

# Variables
AWS_REGION="us-east-1"
ECR_REGISTRY="your-account-id.dkr.ecr.us-east-1.amazonaws.com"
PROJECT_NAME="esg-navigator"

# Build and push Docker images
echo "📦 Building Docker images..."
docker build -t ${PROJECT_NAME}-api:latest -f apps/api/Dockerfile .
docker build -t ${PROJECT_NAME}-web:latest -f apps/web/Dockerfile .

echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

echo "📤 Pushing images to ECR..."
docker tag ${PROJECT_NAME}-api:latest ${ECR_REGISTRY}/${PROJECT_NAME}-api:latest
docker tag ${PROJECT_NAME}-web:latest ${ECR_REGISTRY}/${PROJECT_NAME}-web:latest

docker push ${ECR_REGISTRY}/${PROJECT_NAME}-api:latest
docker push ${ECR_REGISTRY}/${PROJECT_NAME}-web:latest

echo "🔄 Updating ECS services..."
aws ecs update-service --cluster ${PROJECT_NAME}-cluster --service ${PROJECT_NAME}-api --force-new-deployment --region ${AWS_REGION}
aws ecs update-service --cluster ${PROJECT_NAME}-cluster --service ${PROJECT_NAME}-web --force-new-deployment --region ${AWS_REGION}

echo "✅ Deployment complete!"
