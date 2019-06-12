pipeline {
    agent {
        docker {
            image 'jenkinsci/blueocean'
            args '-v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
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
