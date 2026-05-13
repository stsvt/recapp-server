const HybridService = require('../services/hybridRecommendationService');
const Review = require('../models/reviewModel');
const Movie = require('../models/movieModel');
const { calculateUserMeans } = require('../services/itemBasedService');

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

exports.getHybridRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

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
  } catch (err) {
    console.error('Hybrid Controller Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Помилка при формуванні гібридних рекомендацій',
    });
  }
};
