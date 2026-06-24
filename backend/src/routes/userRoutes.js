const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', userController.create);
router.get('/', userController.list);

module.exports = router;