pipeline {
    agent any

    triggers{
        githubPush()
    }

    stages{
        stage('Target'){
            steps{
                sh 'cd api_app/JCAHLS01-Ecommerce-API'
            }
        }
        stage('Pull'){
            steps{
                sh 'git pull origin main'
            }
        }
        stage('Restart'){
            steps{
                sh 'pm2 restart commerce-api'
            }
        }
        stage('Check'){
            steps{
                sh 'pm2 list'
            }
        }
    }
}