const { dbConf } = require("../config/database")

module.exports = {
    getData: (req, res) => {
        dbConf.query('Select iduser, username, email, role FROM users;',(error,resultsUser)=>{
            if(error){
                console.log(error);
                res.status(500).send(error);
            }

            console.log(resultsUser);
            res.status(200).send(resultsUser);
        })
    },
    register: (req, res) => {
        res.status(200).send("<h2>REGISTER</h2>")
        
    },
    login: (req, res) => {
        res.status(200).send("<h2>LOGIN</h2>")
    },
    edit: (req, res) => {

    },
    deActiveAccount: (req, res) => {

    }
}