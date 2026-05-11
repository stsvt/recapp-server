const Review = require('../models/reviewModel');
const Movie = require('../models/movieModel');
const {
  getRecommendationsForMovie,
  calculateUserMeans,
} = require('../services/itemBasedService');
const { getUserRecommendations } = require('../services/userBasedService');

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

exports.getSimilarMovies = async (req, res) => {
  try {
    const { movieId: targetMovieId } = req.query;

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
  } catch (err) {
    console.error('Помилка рекомендаційної системи:', err);
    res.status(500).json({
      status: 'error',
      message: 'Не вдалось отримати рекомендації',
    });
  }
};

exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const { userId } = req.query;

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
  } catch (err) {
    console.error('Помилка User-based системи:', err);
    res.status(500).json({
      status: 'error',
      message: 'Не вдалось отримати персональні рекомендації',
    });
  }
};
