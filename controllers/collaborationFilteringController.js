const Review = require('../models/reviewModel');
const Movie = require('../models/movieModel');
const {
  getRecommendationsForMovie,
  calculateUserMeans,
} = require('../services/itemBasedService');
const { getUserRecommendations } = require('../services/userBasedService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

async function getRatingsData() {
  const reviews = await Review.find({ rating: { $exists: true } })
    .populate('movie', 'tmdbId')
    .select('user movie rating')
    .lean();

  return reviews
    .filter((rev) => rev.movie && rev.movie.tmdbId)
    .map((rev) => ({
      userId: (rev.user._id || rev.user).toString(),
      movieId: rev.movie.tmdbId.toString(),
      score: rev.rating,
    }));
}

exports.getSimilarMovies = catchAsync(async (req, res, next) => {
  const { movieId: targetMovieId } = req.query;

  if (!targetMovieId) {
    return next(new AppError('Please provide a movieId query parameter', 400));
  }

  const allRatings = await getRatingsData();

  const recommendations = await getRecommendationsForMovie(
    targetMovieId,
    allRatings,
  );

  if (!recommendations || recommendations.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: { recommendations: { results: [] } },
    });
  }

  const topRecommendations = recommendations.slice(0, 15);

  const enrichedResults = await Promise.all(
    topRecommendations.map(async (rec) => {
      const movie = await Movie.findOne({ tmdbId: rec.movieId }).select(
        'tmdbId title posterPath releaseDate genres ratingsAverage',
      );

      if (!movie) return null;

      return {
        ...movie.toObject(),
        similarity: rec.similarity,
      };
    }),
  );

  const finalData = enrichedResults.filter((movie) => movie !== null);

  res.status(200).json({
    status: 'success',
    data: {
      recommendations: { results: finalData },
    },
  });
});

exports.getPersonalizedRecommendations = catchAsync(async (req, res, next) => {
  const userId = req.query.userId || (req.user && req.user.id);

  if (!userId) {
    return next(
      new AppError('Please provide a userId query parameter or log in', 400),
    );
  }

  const allRatings = await getRatingsData();
  const userMeans = calculateUserMeans(allRatings);

  const recommendations = await getUserRecommendations(
    userId,
    allRatings,
    userMeans,
  );

  if (!recommendations || recommendations.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: { recommendations: { results: [] } },
    });
  }
  const topRecommendations = recommendations.slice(0, 15);

  const enrichedResults = await Promise.all(
    topRecommendations.map(async (rec) => {
      const movie = await Movie.findOne({ tmdbId: rec.movieId }).select(
        'tmdbId title posterPath releaseDate genres ratingsAverage',
      );

      if (!movie) return null;

      return {
        ...movie.toObject(),
        predictedRating: rec.prediction,
      };
    }),
  );

  const finalData = enrichedResults.filter((movie) => movie !== null);

  res.status(200).json({
    status: 'success',
    data: {
      recommendations: { results: finalData },
    },
  });
});
