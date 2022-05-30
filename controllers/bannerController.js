const { dbConf } = require("../config/database");

module.exports = {
    getData: (req, res) => {
        dbConf.query('Select * FROM banner;', (error, results) => {
            if (error) {
                res.status(500).send(error);
            }

            res.status(200).send(results)
        })
    }
}