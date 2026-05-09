const express = require('express');
const tmdbController = require('../controllers/tmdbController');

const router = express.Router();

router.get('/genres', tmdbController.getMovieGenres);
router.get('/topRated', tmdbController.getTopRatedMovies);
router.get('/topRatedSeries', tmdbController.getTopRatedSeries);
router.get('/topRatedAnimations', tmdbController.getTopRatedAnimations);
router.get('/upcoming', tmdbController.getUpcomingMovies);
router.get('/search', tmdbController.searchMovies);
router.get('/nowPlaying', tmdbController.getNowPlayingMovies);
router.get('/popular', tmdbController.getPopularMovies);

router.get('/', tmdbController.getAllMovies);
router.get('/:id', tmdbController.getMovieById);

module.exports = router;
