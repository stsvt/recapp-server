const UserMovieActivity = require('../models/userMovieActivityModel');
const {
  fetchPopularMoviesFromTMDB,
  getCandidatesFor,
} = require('../utils/tmdbApi');
const recommendationUtils = require('../utils/recommendationUtils');

const TMDB_GENRE_MAP = {
  28: 'бойовик',
  12: 'пригоди',
  16: 'мультфільм',
  35: 'комедія',
  80: 'кримінал',
  99: 'документальний',
  18: 'драма',
  10751: 'сімейний',
  14: 'фентезі',
  36: 'історичний',
  27: 'жахи',
  10402: 'музика',
  9648: 'детектив',
  10749: 'мелодрама',
  878: 'фантастика',
  10770: 'телефільм',
  53: 'трилер',
  10752: 'військовий',
  37: 'вестерн',
};

class RecommendationService {
  static _createFeatureSoup(movie) {
    let genreString = '';

    if (movie.genres && Array.isArray(movie.genres)) {
      genreString =
        typeof movie.genres[0] === 'string'
          ? movie.genres.join(' ')
          : movie.genres.map((genre) => genre.name).join(' ');
    } else if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
      genreString = movie.genre_ids
        .map((id) => TMDB_GENRE_MAP[id] || '')
        .join(' ');
    }

    return `${genreString} ${genreString} ${genreString} ${genreString} ${genreString} ${movie.overview || ''} ${movie.title || ''}`;
  }

  static _buildUserProfileVector(userVectors) {
    const profileVector = {};
    const numMovies = userVectors.length;

    if (numMovies === 0) {
      return profileVector;
    }

    userVectors.forEach((vector) => {
      Object.entries(vector).forEach(([token, value]) => {
        profileVector[token] = (profileVector[token] || 0) + value;
      });
    });

    let sumOfSquares = 0;

    Object.keys(profileVector).forEach((token) => {
      profileVector[token] /= numMovies;
      sumOfSquares += profileVector[token] * profileVector[token];
    });

    const norm = Math.sqrt(sumOfSquares);

    Object.keys(profileVector).forEach((token) => {
      profileVector[token] = norm === 0 ? 0 : profileVector[token] / norm;
    });

    return profileVector;
  }

  static async getContentBasedRecommendations(userId) {
    const userActivities = await UserMovieActivity.find({
      user: userId,
      activityType: { $in: ['liked', 'watched'] },
    }).populate('movie');

    if (!userActivities || userActivities.length === 0) {
      return await fetchPopularMoviesFromTMDB();
    }
    const userMovies = userActivities.map((activity) => activity.movie);

    const tmdbCandidates = await getCandidatesFor(userMovies.slice(0, 3));

    const likedIds = new Set(
      userMovies.map((movie) => movie.id || movie.tmdbId),
    );

    const newCandidates = tmdbCandidates.filter(
      (movie) => !likedIds.has(movie.id),
    );

    const allMovies = [...userMovies, ...newCandidates];

    const corpus = allMovies.map((movie) => {
      const soup = this._createFeatureSoup(movie);
      return recommendationUtils.tokenize(soup);
    });

    const globalIdf = recommendationUtils.calculateIDF(corpus);

    const likedVectors = userMovies.map((_, index) => {
      const tf = recommendationUtils.calculateTF(corpus[index]);
      return recommendationUtils.vectorizeAndNormalize(tf, globalIdf);
    });

    const userProfileVector = this._buildUserProfileVector(likedVectors);

    const recommendations = newCandidates.map((candidate, index) => {
      const corpusIndex = userMovies.length + index;

      const tf = recommendationUtils.calculateTF(corpus[corpusIndex]);
      const candidateVector = recommendationUtils.vectorizeAndNormalize(
        tf,
        globalIdf,
      );

      const score = recommendationUtils.getCosineSimilarity(
        userProfileVector,
        candidateVector,
      );

      return {
        movie: candidate,
        score,
      };
    });

    recommendations.sort((a, b) => b.score - a.score);

    return recommendations
      .slice(0, 10)
      .map((recommendation) => recommendation.movie);
  }
}

module.exports = RecommendationService;
