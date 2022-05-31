const { dbConf, dbQuery } = require("../config/database");

module.exports = {
    getData: async (req, res, next) => {
        try {
            let resultsBanner = await dbQuery('Select * FROM banner;')

            return res.status(200).send(resultsBanner);
        } catch (error) {
            return next(error);
        }
        // dbConf.query('Select * FROM banner;', (error, results) => {
        //     if (error) {
        //         return next(error)
        //     }
        //     return res.status(200).send(results)
        // })
    }
}