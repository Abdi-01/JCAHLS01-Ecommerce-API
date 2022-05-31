const router = require('express').Router();
const { userController } = require('../controllers');

router.get('/get', userController.getData);
router.post('/regis', userController.register);
router.post('/login', userController.login);
router.post('/keep', userController.keepLogin);

module.exports = router;