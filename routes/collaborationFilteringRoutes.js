const express = require('express');

const router = express.Router();
const collaborationFilteringController = require('../controllers/collaborationFilteringController');

router.get('/item-based', collaborationFilteringController.getSimilarMovies);
router.get(
  '/user-based',
  collaborationFilteringController.getPersonalizedRecommendations,
);

module.exports = router;
