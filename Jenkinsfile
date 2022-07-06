pipeline {
    agent any

    triggers{
        githubPush()
    }

    stages{
        stage('Target'){
            steps{
                sh 'cd ../../../../../'
                sh 'cd root/api_app/JCAHLS01-Ecommerce-API/'
            }
        }
        stage('Pull'){
            steps{
                sh 'npm install'
                sh 'git add .'
                sh 'git pull origin main'
            }
        }
        stage('Start'){
            steps{
                sh 'npm run start'
            }
        }
    }
}