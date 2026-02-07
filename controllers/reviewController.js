const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const Movie = require('../models/movieModel');
const AppError = require('../utils/appError');
const { fetchMovieFromTMDB } = require('./tmdbController');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const tmdbId = req.params.movieId;
  const movie = await Movie.findOne({ tmdbId: tmdbId });

  if (!movie) {
    return res
      .status(200)
      .json({ status: 'success', results: 0, data: { reviews: [] } });
  }

  const reviews = await Review.find({ movie: movie._id });

  if (!reviews) {
    return next(new AppError('No reviews found for this movie', 404));
  }

  res
    .status(200)
    .json({ status: 'success', results: reviews.length, data: { reviews } });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating } = req.body;
  const tmdbId = req.params.movieId;

  if (!review || !rating) {
    return next(new AppError('Please provide review text and rating', 400));
  }

  let movie = await Movie.findOne({ tmdbId: tmdbId });

  if (!movie) {
    try {
      const tmdbData = await fetchMovieFromTMDB(tmdbId);

      movie = await Movie.create({
        tmdbId: tmdbData.id,
        title: tmdbData.title,
        releaseDate: tmdbData.release_date,
        genres: tmdbData.genres.map((genre) => genre.name),
        overview: tmdbData.overview,
        posterPath: tmdbData.poster_path,
      });
    } catch (err) {
      return next(
        new AppError('Something went wrong with fetching movie', 400),
      );
    }
  }

  const newReview = await Review.create({
    user: req.user._id,
    movie: movie._id,
    review,
    rating,
  });

  res.status(201).json({ status: 'success', data: { review: newReview } });
});
