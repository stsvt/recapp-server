const express = require('express');
const friendController = require('../controllers/friendController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/', friendController.getMyFriends);
router.get('/incomingRequests', friendController.getIncomingRequests);

router.post('/sendRequest', friendController.sendRequest);
router.patch('/acceptRequest', friendController.acceptRequest);
router.delete('/rejectRequest', friendController.rejectRequest);
router.delete('/removeFriend', friendController.removeFriend);

module.exports = router;
