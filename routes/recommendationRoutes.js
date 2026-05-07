const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/contentBased',
  authController.protect,
  recommendationController.getContentBasedRecommendations,
);

module.exports = router;
