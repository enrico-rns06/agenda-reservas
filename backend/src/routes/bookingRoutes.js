const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');

router.post('/', authenticate, bookingController.create);
router.get('/', authenticate, bookingController.list);
router.patch('/:id/status', authenticate, authorizeRole('professional'), bookingController.updateStatus);

module.exports = router;