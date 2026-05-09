const express = require('express');

const router = express.Router();
const collaborationFilteringController = require('../controllers/collaborationFilteringController');

router.get('/similar/:id', collaborationFilteringController.getSimilarMovies);

module.exports = router;
