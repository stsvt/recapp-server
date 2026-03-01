const express = require('express');
const friendController = require('../controllers/friendController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', friendController.getMyFriends);
router.get('/incomingRequests', friendController.getIncomingRequests);

router.post('/sendRequest/:userId', friendController.sendRequest);
router.patch('/acceptRequest/:userId', friendController.acceptRequest);
router.delete('/rejectRequest/:userId', friendController.rejectRequest);
router.delete('/removeFriend/:userId', friendController.removeFriend);

module.exports = router;
