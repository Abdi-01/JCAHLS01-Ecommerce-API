pipeline {
    agent any

    triggers{
        githubPush()
    }

    stages{
        stage('Target Dir'){
            steps{
                sh 'cd ../../../../../'
                sh 'cd root/api_app/JCAHLS01-Ecommerce-API/'
            }
        }
        stage('Pull'){
            steps{
                sh 'git add .'
                sh 'git pull origin main'
            }
        }
        stage('Restart'){
            steps{
                sh 'sudo su - root -c "pm2 restart all"'
            }
        }
        stage('Check'){
            steps{
                sh 'pm2 list'
            }
        }
    }
}