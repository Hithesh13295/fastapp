pipeline {
    agent any

    environment {
        AWS_REGION = "eu-north-1"
        ECR_REPO = "fastapp"
        ACCOUNT_ID = "947754984980"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CLUSTER_NAME = "fastapp-cluster"
    }

    stages {
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
                sh 'docker build -t fastapp:${IMAGE_TAG} .'
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS \
                --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Tag & Push') {
            steps {
                sh '''
                docker tag fastapp:${IMAGE_TAG} \
                $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:${IMAGE_TAG}

                docker push \
                $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:${IMAGE_TAG}
                '''
            }
        }

        stage('Update Kubeconfig') {
            steps {
                sh '''
                aws eks update-kubeconfig \
                --region $AWS_REGION \
                --name $CLUSTER_NAME
                '''
            }
        }

        stage('Helm Deploy') {
            steps {
                helm upgrade --install fastapp ./helm/fastapp \
                --set image.repository=$ECR_REPO \
                --set image.tag=$IMAGE_TAG
            }
        }
    }
}
