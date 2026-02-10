const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

router.route('/').get(movieController.getAllMovies);

router.route('/:id').get(movieController.getMovieById);

module.exports = router;
