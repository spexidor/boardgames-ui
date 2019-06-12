pipeline {
    agent {
        docker {
            image 'jenkinsci/blueocean'
            args '-v jenkins_data:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
        }
    }
    stages {
        stage('Docker container') { 
            steps {
                sh 'whoami'
                sh './jenkins/deploy.sh'
            }
        }
    }
}
