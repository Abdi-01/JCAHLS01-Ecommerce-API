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
                sh '#!/bin/sh
                    ssh root@139.162.45.176<<EOF
                    pm2 restart all
                    exit
                    EOF'
            }
        }
    }
}