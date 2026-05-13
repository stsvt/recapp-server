const express = require('express');

const hybridController = require('../controllers/hybridRecommendationController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/',
  authController.protect,
  hybridController.getHybridRecommendations,
);

module.exports = router;
