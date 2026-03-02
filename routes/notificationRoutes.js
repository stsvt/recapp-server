const express = require('express');
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect);

router.patch('/readAll', notificationController.markAsReadAll);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
