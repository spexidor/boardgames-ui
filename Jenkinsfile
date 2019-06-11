pipeline {
    agent {
        docker {
            image 'node:6-alpine' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Docker container') { 
            steps {
                sh './jenkins/deploy.sh'
            }
        }
    }
}