pipeline {
    agent any

    environment {
        PROJECT_NAME = "facturacion-sunat-frontend"
        DOCKER_COMPOSE_FILE = "docker-compose.prod.yml"
        API_URL = "https://api.tu-produccion.com/api/v1"
    }

    stages {

    stage('Environment Audit') {
        steps {
            script {
                try {
                    def dockerPath = tool name: 'docker', type: 'docker'
                    env.PATH = "${dockerPath}/bin:${env.PATH}"
                    echo "Docker tool found at ${dockerPath}"
                } catch (e) {
                    echo "No se encontró la herramienta 'docker' configurada en Jenkins. Usando comandos del sistema..."
                }
            }
            echo "Verificando herramientas en el servidor..."
            sh 'docker --version || echo "ERROR: El comando docker no está instalado en el servidor Jenkins"'
            sh 'docker-compose --version || echo "ERROR: El comando docker-compose no está instalado en el servidor Jenkins"'
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
