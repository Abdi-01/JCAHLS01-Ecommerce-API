const router = require('express').Router();
const { readToken } = require('../config/encription');
const { userController } = require('../controllers');

router.get('/get', userController.getData);
router.post('/regis', userController.register);
router.post('/login', userController.login);
router.get('/keep', readToken, userController.keepLogin);

module.exports = router;