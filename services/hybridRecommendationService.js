const UserBasedService = require('./userBasedService');
const ContentBasedService = require('./recommendationService');

exports.getHybridRecommendations = async (userId, allRatings, userMeans) => {
  const [cfResults, cbResults] = await Promise.all([
    UserBasedService.getUserRecommendations(userId, allRatings, userMeans),
    ContentBasedService.getContentBasedRecommendations(userId),
  ]);

  const hybridMap = new Map();

  cfResults.forEach((rec) => {
    const movieId = rec.movieId.toString();
    const normalizedCfScore = (rec.prediction - 1) / 9;

    hybridMap.set(movieId, {
      movieId,
      cfScore: normalizedCfScore,
      cbScore: 0,
      prediction: rec.prediction,
    });
  });

  cbResults.forEach((movie, index) => {
    const movieId = (movie.tmdbId || movie.id).toString();
    const cbScore = 1 - index / cbResults.length;

    if (hybridMap.has(movieId)) {
      hybridMap.get(movieId).cbScore = cbScore;
    } else {
      hybridMap.set(movieId, {
        movieId,
        cfScore: 0,
        cbScore: cbScore,
        movieData: movie,
      });
    }
  });

  const ALPHA = 0.5;

  const finalResults = Array.from(hybridMap.values()).map((item) => {
    const finalScore = item.cfScore * ALPHA + item.cbScore * (1 - ALPHA);
    return {
      movieId: item.movieId,
      finalScore,
      movieData: item.movieData || null,
    };
  });

  return finalResults.sort((a, b) => b.finalScore - a.finalScore).slice(0, 20);
};
