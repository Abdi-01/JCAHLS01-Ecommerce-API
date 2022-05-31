const { dbConf } = require("../config/database")

module.exports = {
    getData: (req, res, next) => {
        dbConf.query('Select iduser, username, email, role FROM users;', (error, resultsUser) => {
            if (error) {
                return next(error);
            }

            // res.status(200).send(resultsUser);
            dbConf.query('Select * FROM cart;', (errorCart, resultsCart) => {
                if (errorCart) {
                    return next(errorCart);
                }

                resultsUser.forEach((val, idx) => {
                    val.cart = [];
                    resultsCart.forEach((valCart, idxCart) => {
                        if (val.iduser == valCart.iduser) {
                            val.cart.push(valCart)
                        }
                    })
                })

                return res.status(200).send(resultsUser);

            })
        })


    },
    register: (req, res, next) => {
        res.status(200).send("<h2>REGISTER</h2>")

    },
    login: (req, res, next) => {
        res.status(200).send("<h2>LOGIN</h2>")
    },
    edit: (req, res, next) => {

    },
    deActiveAccount: (req, res, next) => {

    }
}