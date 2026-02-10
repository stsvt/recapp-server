const express = require('express');
const authController = require('../controllers/authController');
const activityController = require('../controllers/activityController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: User activity management (likes, views)
 */

router.use(authController.protect);

router.post('/', activityController.toggleActivity);

router.get('/status/:tmdbId', activityController.checkMovieStatus);

module.exports = router;
