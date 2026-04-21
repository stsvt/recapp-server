const express = require('express');
const movieController = require('../controllers/movieController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:movieId/reviews', reviewRouter);

router.route('/').get(movieController.getAllMovies);

router.route('/:id').get(movieController.getMovieById);

module.exports = router;
