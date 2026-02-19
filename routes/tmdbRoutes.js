const express = require('express');
const tmdbController = require('../controllers/tmdbController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TMDB
 *   description: TMDB Movie management
 */

router.get('/genres', tmdbController.getMovieGenres);
router.get('/topRated', tmdbController.getTopRatedMovies);
router.get('/upcoming', tmdbController.getUpcomingMovies);
router.get('/search', tmdbController.searchMovies);
router.get('/nowPlaying', tmdbController.getNowPlayingMovies);

router.get('/', tmdbController.getAllMovies);
router.get('/:id', tmdbController.getMovieById);

module.exports = router;
