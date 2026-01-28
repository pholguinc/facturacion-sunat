pipeline {
    agent any

    environment {
        PROJECT_NAME = "facturacion-sunat"
        DOCKER_COMPOSE_FILE = "docker-compose.prod.yml"
        API_URL = "https://api.tu-produccion.com/api/v1"
    }

    stages {
        stage('Checkout') {
            steps {
                // He cambiado 'main' por 'master' porque es lo que veo en tus logs
                git branch: 'master', 
                    credentialsId: 'github-creds', 
                    url: 'https://github.com/pholguinc/facturacion-sunat.git'
            }
        }

        stage('Environment Audit') {
            steps {
                echo "Environment Information:"
                sh 'docker --version'
                sh 'docker-compose --version'
                sh 'bun --version || echo "Bun not installed on host, will use Docker for everything"'
            }
        }

        stage('Build & Deploy') {
            steps {
                echo "Building and deploying ${PROJECT_NAME} in production mode..."
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d"
            }
        }

        stage('Cleanup') {
            steps {
                echo "Removing dangling images to save space..."
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "Deployment of ${PROJECT_NAME} finished successfully!"
        }
        failure {
            echo "Deployment of ${PROJECT_NAME} failed. Please check the logs."
        }
    }
}
