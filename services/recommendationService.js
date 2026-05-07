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

    console.log('Genres: ', genreString);
    console.log('Overview: ', movie.overview);
    console.log('Title: ', movie.title);
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

  static async getPersonalRecommendations(userId) {
    const userActivities = await UserMovieActivity.find({
      user: userId,
      activityType: { $in: ['liked', 'watched'] },
    }).populate('movie');

    if (!userActivities || userActivities.length === 0) {
      console.log('Recommendations from TMDB');
      return await fetchPopularMoviesFromTMDB();
    }
    const userMovies = userActivities.map((activity) => activity.movie);

    // console.log(userMovies);
    const tmdbCandidates = await getCandidatesFor(userMovies.slice(0, 3));

    // console.log('TMDB Candidates: ', tmdbCandidates);

    const likedIds = new Set(
      userMovies.map((movie) => movie.id || movie.tmdbId),
    );

    const newCandidates = tmdbCandidates.filter(
      (movie) => !likedIds.has(movie.id),
    );

    // console.log('NEW CANDIDATES: ', newCandidates);
    // console.log('User movies: ', userMovies);
    const allMovies = [...userMovies, ...newCandidates];

    console.log('User movies: ', userMovies[0]);
    console.log('New candidates: ', newCandidates[0]);
    const corpus = allMovies.map((movie) => {
      const soup = this._createFeatureSoup(movie);
      return recommendationUtils.tokenize(soup);
    });

    // console.log('CORPUS', corpus);
    const globalIdf = recommendationUtils.calculateIDF(corpus);

    // console.log('GLOBAL IDF: ', globalIdf);
    // console.log('Length: ', userMovies.length);
    // console.log('Corpus length: ', corpus.length);
    const likedVectors = userMovies.map((_, index) => {
      // console.log('index', index);
      // console.log('CORPUS INDEX: ', corpus[index]);
      const tf = recommendationUtils.calculateTF(corpus[index]);
      // console.log('TF', tf);
      return recommendationUtils.vectorizeAndNormalize(tf, globalIdf);
    });

    // console.log('LIKED VECTORS: ', likedVectors);

    const userProfileVector = this._buildUserProfileVector(likedVectors);

    const recommendations = newCandidates.map((candidate, index) => {
      const corpusIndex = userMovies.length + index;

      const tf = recommendationUtils.calculateTF(corpus[corpusIndex]);
      const candidateVector = recommendationUtils.vectorizeAndNormalize(
        tf,
        globalIdf,
      );
      // console.log('Candidate vector: ', candidateVector);
      // console.log('User profile vector: ', userProfileVector);
      const score = recommendationUtils.getCosineSimilarity(
        userProfileVector,
        candidateVector,
      );

      console.log('SCORE: ', score);
      return {
        movie: candidate,
        score,
      };
    });

    recommendations.sort((a, b) => b.score - a.score);

    console.log(
      recommendations
        .slice(0, 10)
        .map((recommendation) => recommendation.movie),
    );
    return recommendations
      .slice(0, 10)
      .map((recommendation) => recommendation.movie);
  }
}

module.exports = RecommendationService;
