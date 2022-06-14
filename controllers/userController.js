const { dbConf, dbQuery } = require("../config/database");
const { hashPassword, createToken } = require('../config/encription');
const { transporter } = require('../config/nodemailer');
module.exports = {
    getData: async (req, res, next) => {
        try {

            let resultsUsers = await dbQuery('Select iduser,username,email,role FROM users');

            let resultsCart = await dbQuery(`Select p.nama, i.urlImg , p.harga, s.type, 
            s.qty as stockQty, c.* FROM cart c 
            JOIN stocks s ON c.idstock = s.idstock
            JOIN products p ON p.idproduct = s.idproduct
            JOIN images i ON i.idproduct = p.idproduct GROUP BY c.idcart;`);

            resultsUsers.forEach((val, idx) => {
                val.cart = [];
                resultsCart.forEach((valCart, idxCart) => {
                    if (val.iduser == valCart.iduser) {
                        val.cart.push(valCart)
                    }
                })
            })

            return res.status(200).send(resultsUsers);
        } catch (error) {
            return next(error)
        }
    },
    register: async (req, res, next) => {
        try {

            let insertData = await dbQuery(`insert into users (username, email, password, role)
            values (${dbConf.escape(req.body.username)},${dbConf.escape(req.body.email)},
            ${dbConf.escape(hashPassword(req.body.password))},${dbConf.escape(req.body.role)});`);

            // console.log(insertData);
            if (insertData.insertId) {
                let resultsLogin = await dbQuery(`Select iduser,username,email,role, status FROM users 
                WHERE iduser=${insertData.insertId};`);
                if (resultsLogin.length == 1) {
                    // Generate token
                    let { iduser, username, email, role, status } = resultsLogin[0];

                    let token = createToken({ iduser, username, email, role, status }, "1h");

                    // Mengirimkan email
                    await transporter.sendMail({
                        from: "Admin Commerce",
                        to: email,
                        subject: "Verification Email Acount",
                        html: `<div> 
                        <h3>Click Link Below :</h3>
                        <a href="${process.env.FE_URL}/verification/${token}">Verified Account Here</a>
                        </div>`
                    })

                    return res.status(200).send({ ...resultsLogin[0], token })
                } else {
                    return res.status(404).send({
                        success: false,
                        message: "User not found ⚠️"
                    });
                }

            }
            res.status(200).send("<h2>REGISTER</h2>")
        } catch (error) {
            return next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            //    console.log(req.body)
            let resultsLogin = await dbQuery(`Select iduser,username,email,role, status FROM users 
            WHERE email='${req.body.email}' AND password='${hashPassword(req.body.password)}' ;`);
            console.log(resultsLogin)
            if (resultsLogin[0].iduser) {
                let resultsCart = await dbQuery(`Select p.nama, i.urlImg , p.harga, s.type, 
                s.qty as stockQty, c.* FROM cart c 
                JOIN stocks s ON c.idstock = s.idstock
                JOIN products p ON p.idproduct = s.idproduct
                JOIN images i ON i.idproduct = p.idproduct WHERE c.iduser=${resultsLogin[0].iduser}
                GROUP BY c.idcart;`);

                resultsLogin[0].cart = resultsCart;

                // Me-generate token
                let { iduser, username, email, role, status } = resultsLogin[0]
                let token = createToken({ iduser, username, email, role, status });
                return res.status(200).send({ ...resultsLogin[0], token });
            } else {
                return res.status(404).send({
                    success: false,
                    message: "User not found ⚠️"
                });
            }

        } catch (error) {
            return next(error);
        }
    },
    keepLogin: async (req, res, next) => {
        try {
            if (req.dataUser) {
                let resultsLogin = await dbQuery(`Select iduser,username,email,role, status FROM users 
                WHERE iduser=${req.dataUser.iduser} ;`);

                if (resultsLogin[0].iduser) {
                    let resultsCart = await dbQuery(`Select p.nama, i.urlImg , p.harga, s.type, 
                    s.qty as stockQty, c.* FROM cart c 
                    JOIN stocks s ON c.idstock = s.idstock
                    JOIN products p ON p.idproduct = s.idproduct
                    JOIN images i ON i.idproduct = p.idproduct WHERE c.iduser=${resultsLogin[0].iduser}
                    GROUP BY c.idcart;`);
                    resultsLogin[0].cart = resultsCart;

                    // Me-generate token
                    let { iduser, username, email, role, status } = resultsLogin[0]
                    let token = createToken({ iduser, username, email, role, status });
                    return res.status(200).send({ ...resultsLogin[0], token });
                } else {
                    return res.status(404).send({
                        success: false,
                        message: "User not found ⚠️"
                    });
                }
            }
        } catch (error) {
            return next(error);
        }
    },
    verifiedAccount: async (req, res, next) => {
        try {
            if (req.dataUser) {
                let update = await dbQuery(`UPDATE users SET status='Verified' WHERE iduser=${req.dataUser.iduser};`)
                console.log(update)
                let resultsLogin = await dbQuery(`Select iduser,username,email,role, status FROM users 
                WHERE iduser=${req.dataUser.iduser} ;`);

                let { iduser, username, email, role, status } = resultsLogin[0]
                let token = createToken({ iduser, username, email, role, status });
                return res.status(200).send({ ...resultsLogin[0], token, success: true });
            }
        } catch (error) {
            return next(error)
        }
    },
    reVerified: async (req, res, next) => {
        try {
            if (req.dataUser) {
                let resultsLogin = await dbQuery(`Select iduser,username,email,role, status FROM users 
                WHERE iduser=${req.dataUser.iduser};`);

                let { iduser, username, email, role, status } = resultsLogin[0];
                let token = createToken({ iduser, username, email, role, status }, "1h");

                // Mengirimkan email
                await transporter.sendMail({
                    from: "Admin Commerce",
                    to: email,
                    subject: "Re-Verification Email Acount",
                    html: `<div> 
                    <h3>Click Link Below :</h3>
                    <a href="${process.env.FE_URL}/verification/${token}">Verified Account Here</a>
                    </div>`
                })

                return res.status(200).send({
                    success:true,
                    message:"Reverification email link delivered ✅"
                })
            }
        } catch (error) {
            return next(error)
        }
    },
    deActiveAccount: (req, res, next) => {

    }
}