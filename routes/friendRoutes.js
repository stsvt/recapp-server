const express = require('express');
const friendController = require('../controllers/friendController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/', friendController.getMyFriends);
router.get('/incomingRequests', friendController.getIncomingRequests);

router.post('/', friendController.sendRequest);
router.patch('/', friendController.acceptRequest);
router.delete('/', friendController.rejectRequest);
router.delete('/remove', friendController.removeFriend);

module.exports = router;
