const AppError = require('../utils/appError');
const Movie = require('../models/movieModel');
const { fetchMovieFromTMDB } = require('../utils/tmdbApi');

exports.getOrCreateMovie = async (tmdbId) => {
  let movie = await Movie.findOne({ tmdbId });

  if (movie) {
    return movie;
  }

  let tmdbData;

  try {
    tmdbData = await fetchMovieFromTMDB(tmdbId);
  } catch (err) {
    throw new AppError(
      `Could not fetch movie from TMDB with ID ${tmdbId}`,
      404,
    );
  }

  movie = await Movie.findOneAndUpdate(
    { tmdbId },
    {
      tmdbId: tmdbData.id,
      title: tmdbData.title,
      releaseDate: tmdbData.release_date,
      genres: tmdbData.genres.map((genre) => genre.name),
      overview: tmdbData.overview,
      posterPath: tmdbData.poster_path,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );

  return movie;
};
