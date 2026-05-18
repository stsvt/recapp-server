const HybridService = require('../services/hybridRecommendationService');
const Review = require('../models/reviewModel');
const Movie = require('../models/movieModel');
const { calculateUserMeans } = require('../services/itemBasedService');
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

exports.getHybridRecommendations = catchAsync(async (req, res, next) => {
  const userId = req.user && req.user.id;

  if (!userId) {
    return next(
      new AppError('Please log in to get hybrid recommendations', 401),
    );
  }

  const allRatings = await getRatingsData();
  const userMeans = calculateUserMeans(allRatings);

  const recommendations = await HybridService.getHybridRecommendations(
    userId,
    allRatings,
    userMeans,
  );

  const enrichedResults = await Promise.all(
    recommendations.map(async (rec) => {
      let movie = await Movie.findOne({ tmdbId: rec.movieId }).select(
        'tmdbId title posterPath releaseDate genres ratingsAverage overview',
      );

      if (!movie && rec.movieData) {
        movie = rec.movieData;
      }

      return movie
        ? {
            ...(movie.toObject ? movie.toObject() : movie),
            hybridScore: rec.finalScore,
          }
        : null;
    }),
  );

  res.status(200).json({
    status: 'success',
    results: enrichedResults.length,
    data: {
      recommendations: enrichedResults.filter((m) => m !== null),
    },
  });
});
