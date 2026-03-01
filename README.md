# FastApp DevOps Project

## Architecture
- Terraform provisions VPC + EKS
- Docker builds Node app
- ECR stores image
- Helm deploys to EKS
- Jenkins automates CI/CD

## Run locally
docker build -t fastapp .
docker run -p 3000:3000 fastapp

## Deploy
helm upgrade --install fastapp helm/fastapp