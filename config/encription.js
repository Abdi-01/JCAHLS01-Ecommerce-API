const jwt = require('jsonwebtoken');
const Crypto = require('crypto');

module.exports = {
    hashPassword: (pass) => {
        return Crypto.createHmac("sha256", "JCAHLS-01").update(pass).digest("hex");
    },
    createToken: (payload, time = "24h") => {
        let token = jwt.sign(payload, "JCAHLS-01", {
            expiresIn: time
        })

        return token;
    },
    readToken: (req, res, next) => {
        jwt.verify(req.token, "JCAHLS-01", (err, decode) => {
            if (err) {
                res.status(401).send({
                    message: "User Not Authentication ❌"
                })
            }

            req.dataUser = decode;

            next();
        })
    }
}