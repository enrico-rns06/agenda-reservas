const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.create);
router.get('/', bookingController.list);
router.patch('/:id/status', bookingController.updateStatus);

module.exports = router;