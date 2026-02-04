const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/genres', movieController.getMovieGenres);
router.get('/upcoming', movieController.getUpcomingMovies);
router.get('/now_playing', movieController.getNowPlayingMovies);

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;
