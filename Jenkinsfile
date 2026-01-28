pipeline {
    agent any

    environment {
        PROJECT_NAME = "facturacion-sunat"
        DOCKER_COMPOSE_FILE = "docker-compose.prod.yml"
        API_URL = "https://api.tu-produccion.com/api/v1"
    }

    stages {

        stage('Environment Audit') {
        steps {
            echo "Verificando herramientas en el servidor..."
            sh 'docker --version'
            sh 'docker-compose --version'
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
