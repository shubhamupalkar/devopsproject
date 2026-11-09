pipeline {
    agent any

    triggers {
        // Automatically triggers when GitHub sends a push webhook, or falls back to polling every 2 mins
        githubPush()
        pollSCM('H/2 * * * *')
    }

    environment {
        COMPOSE_PROJECT_NAME = 'devopsproject'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '=== Stage 1: Checking out latest code from GitHub ==='
                checkout scm
            }
        }

        stage('Validate Configuration') {
            steps {
                echo '=== Stage 2: Validating Docker Compose configuration ==='
                sh 'docker compose config'
            }
        }

        stage('Build & Deploy Containers') {
            steps {
                echo '=== Stage 3: Building updated images and replacing old containers ==='
                // Builds fresh backend & frontend images, recreates changed containers, removes old containers
                sh 'docker compose up -d --build --remove-orphans backend frontend db'
            }
        }

        stage('Clean Unused Images') {
            steps {
                echo '=== Stage 4: Pruning dangling Docker images to save disk space ==='
                sh 'docker image prune -f'
            }
        }

        stage('Smoke Test & Health Check') {
            steps {
                echo '=== Stage 5: Verifying application & database health ==='
                sh '''
                    echo "Checking container status..."
                    docker compose ps
                    
                    echo "Waiting 5 seconds for services to stabilize..."
                    sleep 5
                    
                    echo "Testing Backend API via Nginx..."
                    curl -s -f http://frontend:80/api/health || curl -s -f http://localhost:80/api/health
                    
                    echo ""
                    echo "Testing Database items API..."
                    curl -s -f http://frontend:80/api/items || curl -s -f http://localhost:80/api/items
                    
                    echo ""
                    echo "All health checks passed successfully!"
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment Succeeded! New containers are live and healthy.'
        }
        failure {
            echo '❌ Deployment Failed! Printing container logs:'
            sh 'docker compose logs --tail=50'
        }
    }
}
