const { dbConf } = require("../config/database");

module.exports = {
    getData: (req, res, next) => {
        dbConf.query('Select * FROM data;', (error, results) => {
            if (error) {
                return next(error)
            }
            return res.status(200).send(results)
        })
    }
}