const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Movie = require('../models/movieModel');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.find();

  if (movies.length === 0) {
    return next(new AppError('No movies found', 404));
  }

  res
    .status(200)
    .json({ status: 'success', results: movies.length, data: { movies } });
});

exports.getMovieById = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).populate('reviews');

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({ status: 'success', data: { movie } });
});
