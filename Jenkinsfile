pipeline {
    agent any

    environment {
        ACCOUNT_SERVICE_DIR = 'account-service'
        COURSE_SERVICE_DIR = 'course-service'
        FRONTEND_DIR = 'client'
        DOCKER_IMAGE_ACCOUNT = 'mohamedelsadat/account-service'
        DOCKER_IMAGE_COURSE = 'mohamedelsadat/course-service'
        DOCKER_IMAGE_FRONTEND = 'mohamedelsadat/client-service'
        REPO_URL = 'https://github.com/moheladwy/E-LearningDeployment.git'
        BRANCH = 'main'
        DOCKER_CREDENTIALS_ID = 'DOCKER_HUB_ID'
        BUILD_TAG = "V1.${env.BUILD_NUMBER}"
        KUBECONFIG = '/var/lib/jenkins/.kube/config' // Ensure this path is correct
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Build Docker account') {
            steps {
                dir(ACCOUNT_SERVICE_DIR) {
                    script {
                        sh 'docker build -t $DOCKER_IMAGE_ACCOUNT:${BUILD_TAG} .'
                        echo "Docker image for account service built successfully."
                    }
                }
            }
        }

        stage('Build Docker course') {
            steps {
                dir(COURSE_SERVICE_DIR) {
                    script {
                        sh 'docker build -t $DOCKER_IMAGE_COURSE:${BUILD_TAG} .'
                        echo "Docker image for course service built successfully."
                    }
                }
            }
        }

        stage('Build Docker Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    script {
                        sh 'docker build -t $DOCKER_IMAGE_FRONTEND:${BUILD_TAG} .'
                        echo "Docker image for frontend built successfully."
                    }
                }
            }
        }

        stage('Tag Docker Images as latest') {
            steps {
                script {
                    sh "docker tag ${DOCKER_IMAGE_ACCOUNT}:${BUILD_TAG} ${DOCKER_IMAGE_ACCOUNT}:latest"
                    sh "docker tag ${DOCKER_IMAGE_COURSE}:${BUILD_TAG} ${DOCKER_IMAGE_COURSE}:latest"
                    sh "docker tag ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG} ${DOCKER_IMAGE_FRONTEND}:latest"
                    echo "Docker images tagged successfully."
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh "docker push ${DOCKER_IMAGE_ACCOUNT}:${BUILD_TAG}"
                    sh "docker push ${DOCKER_IMAGE_ACCOUNT}:latest"
                    sh "docker push ${DOCKER_IMAGE_COURSE}:${BUILD_TAG}"
                    sh "docker push ${DOCKER_IMAGE_COURSE}:latest"
                    sh "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG}"
                    sh "docker push ${DOCKER_IMAGE_FRONTEND}:latest"
                    echo "Docker images pushed successfully."
                }
            }
        }

        // Kubernetes Deployment Stage
        stage('Run Ansible Playbook') {
            steps {
                ansiblePlaybook(
                    playbook: 'ansible/apply_k8s_resources.yaml',
                    inventory: 'ansible/inventory.ini'
                )
            }
        }
    }

    post {
        always {
            cleanWs()
            echo "Workspace cleaned up after pipeline completion."
        }

        failure {
            echo "Pipeline failed."
        }

        success {
            echo "Pipeline completed successfully."
        }
    }
}
