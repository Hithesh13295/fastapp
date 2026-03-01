pipeline {
    agent any

    environment {
        AWS_REGION = "eu-north-1"
        ECR_REPO = "947754984980.dkr.ecr.eu-north-1.amazonaws.com/fastapp"
        IMAGE_TAG = "latest"
        CLUSTER_NAME = "fastapp-eks-cluster"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/Hithesh13295/fastapp.git'
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t fastapp .'
            }
        }

        stage('ECR Login') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin 947754984980.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                docker tag fastapp:latest $ECR_REPO:$IMAGE_TAG
                docker push $ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Update Kubeconfig') {
            steps {
                sh '''
                aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
                '''
            }
        }

        stage('Helm Deploy') {
            steps {
                sh '''
                helm upgrade --install fastapp ./fastapp \
                --set image.repository=$ECR_REPO \
                --set image.tag=$IMAGE_TAG
                '''
            }
        }
    }
}