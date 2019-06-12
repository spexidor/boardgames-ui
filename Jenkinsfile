pipeline {
    agent {
        docker {
            image 'jenkinsci/blueocean'
            args '-v /root/.m2:/root/.m2 -v jenkins_data:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
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
