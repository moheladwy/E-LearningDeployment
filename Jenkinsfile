pipeline {
    agent any

    environment {
        ACCOUNT_SERVICE_DIR = 'account-service'
        COURSE_SERVICE_DIR = 'course-service'
        FRONTEND_DIR = 'client'
        DOCKER_IMAGE_ACCOUNT = 'only1adwy/accounts'
        DOCKER_IMAGE_COURSE = 'only1adwy/courses'
        DOCKER_IMAGE_FRONTEND = 'only1adwy/client'
        REPO_URL = 'https://github.com/HunterElite0/online-learning-platform'
        BRANCH = 'main'
        BUILD_TAG = "V1.${env.BUILD_NUMBER}"
    }

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
                // Login to Docker Hub using Jenkins credentials
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                }
            }
        }
    }

    stage('Push Docker account') {
        steps {
            script {
                sh "docker push ${DOCKER_IMAGE_ACCOUNT}:${BUILD_TAG}"
                sh "docker push ${DOCKER_IMAGE_ACCOUNT}:latest"

                sh "docker push ${DOCKER_IMAGE_COURSE}:${BUILD_TAG}"
                sh "docker push ${DOCKER_IMAGE_COURSE}:latest"

                sh "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG}"
                sh "docker push ${DOCKER_IMAGE_FRONTEND}:latest"
                
                echo "Docker image for account service pushed successfully."
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
