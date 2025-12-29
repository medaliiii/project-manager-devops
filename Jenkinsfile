pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
  }

  parameters {
    booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Déployer via docker-compose sur serveur distant')
    string(name: 'REMOTE_HOST', defaultValue: '', description: 'Hôte SSH pour déploiement (ex: user@server)')
    string(name: 'REMOTE_COMPOSE_DIR', defaultValue: '/opt/project-manager', description: 'Chemin distant du projet avec docker-compose.yml')
  }

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub' 
    IMAGE_BACKEND = 'daliii/project-manager-backend'
    IMAGE_FRONT   = 'daliii/project-manager-frontend'
    DOCKER_BUILDKIT = '1'
  }

  stages {

    stage('Checkout Code') {
      steps {
        deleteDir()
        checkout scm
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
          '''
        }
      }
    }

    stage('Build & Push Backend Image') {
      steps {
        sh '''
          set -eux
          docker build -t ${IMAGE_BACKEND}:${BUILD_NUMBER} backend
          docker push ${IMAGE_BACKEND}:${BUILD_NUMBER}
          docker tag  ${IMAGE_BACKEND}:${BUILD_NUMBER} ${IMAGE_BACKEND}:latest
          docker push ${IMAGE_BACKEND}:latest
        '''
      }
    }

    stage('Build & Push Front Image') {
      steps {
        sh '''
          set -eux
          docker build -t ${IMAGE_FRONT}:${BUILD_NUMBER} front
          docker push ${IMAGE_FRONT}:${BUILD_NUMBER}
          docker tag  ${IMAGE_FRONT}:${BUILD_NUMBER} ${IMAGE_FRONT}:latest
          docker push ${IMAGE_FRONT}:latest
        '''
      }
    }

    stage('Trivy Scan (backend)') {
      steps {
        sh '''
          set -eux
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:latest image --no-progress \
            --severity CRITICAL,HIGH \
            ${IMAGE_BACKEND}:${BUILD_NUMBER} | tee trivy_report_backend.txt || true
        '''
        archiveArtifacts artifacts: 'trivy_report_backend.txt', onlyIfSuccessful: false
      }
    }

    stage('Trivy Scan (front)') {
      steps {
        sh '''
          set -eux
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:latest image --no-progress \
            --severity CRITICAL,HIGH \
            ${IMAGE_FRONT}:${BUILD_NUMBER} | tee trivy_report_front.txt || true
        '''
        archiveArtifacts artifacts: 'trivy_report_front.txt', onlyIfSuccessful: false
      }
    }

    stage('Deploy (optional)') {
      when { expression { return params.DEPLOY && params.REMOTE_HOST?.trim() && params.REMOTE_COMPOSE_DIR?.trim() } }
      steps {
        // Nécessite le plugin SSH Agent et une clé configurée comme credential 'ssh_vm'
        sshagent(credentials: ['ssh_vm']) {
          sh '''
            set -eux
            ssh -o StrictHostKeyChecking=no ${REMOTE_HOST} \
              "cd ${REMOTE_COMPOSE_DIR} && docker compose pull && docker compose up -d"
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker system prune -af || true'
    }
    success {
      echo "✅ Build terminé, images poussées, et rapports Trivy archivés."
    }
    failure {
      echo "❌ Build échoué — vérifie la console Jenkins."
    }
  }
}
