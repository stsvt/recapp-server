const express = require('express');

const router = express.Router();
const collaborationFilteringController = require('../controllers/collaborationFilteringController');
const authController = require('../controllers/authController');

router.get('/item-based', collaborationFilteringController.getSimilarMovies);
router.get(
  '/user-based',
  authController.protect,
  collaborationFilteringController.getPersonalizedRecommendations,
);

module.exports = router;
