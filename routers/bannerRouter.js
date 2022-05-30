const router = require('express').Router();
const { bannerController } = require('../controllers');

router.get('/get', bannerController.getData);

module.exports = router;