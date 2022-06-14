const router = require('express').Router();
const { readToken } = require('../config/encription');
const { productsController } = require('../controllers');

router.get('/', productsController.getData);
router.post('/', readToken, productsController.addData);

module.exports = router;