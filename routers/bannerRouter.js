const router = require('express').Router();
const { bannerController } = require('../controllers');

router.get('/get', bannerController.getData);
router.post('/add', bannerController.addData);
router.delete('/del', bannerController.deleteData);
router.patch('/update', bannerController.update);

module.exports = router;