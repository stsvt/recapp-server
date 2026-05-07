const AppError = require('./appError');

exports.fetchMovieFromTMDB = async (id) => {
  const url = `${process.env.TMDB_BASIC_URL}movie/${id}?append_to_response=credits,videos,recommendations&language=uk-UA`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    throw new AppError(
      `Failed to fetch from TMDB: ${response.statusText}`,
      response.status,
    );
  }

  return await response.json();
};

exports.fetchPopularMoviesFromTMDB = async (page = 1) => {
  const tmdbParams = new URLSearchParams({
    language: 'uk-UA',
    page: page,
    region: 'UA',
  });

  const url = `${process.env.TMDB_BASIC_URL}movie/popular?${tmdbParams}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    throw new AppError('Failed to fetch popular movies', 400);
  }

  return await response.json();
};

exports.getCandidatesFor = async (likedMovies) => {
  const tmdbParams = new URLSearchParams({
    language: 'uk-UA',
    page: 1,
    region: 'UA',
  });

  try {
    const requests = likedMovies.map((movie) => {
      const url = `${process.env.TMDB_BASIC_URL}movie/${movie.tmdbId}/similar?${tmdbParams}`;
      return fetch(url, {
        headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
      }).then((res) => {
        if (!res.ok) {
          throw new AppError('Failed to fetch similar movies', 400);
        }
        return res.json();
      });
    });

    const responses = await Promise.all(requests);

    // console.log('RESPONSES: ', responses[0]);
    const allCandidates = responses.map((res) => res.results).flat();
    // console.log('All candidates: ', allCandidates);

    const uniqueCandidatesMap = new Map();

    allCandidates.forEach((movie) => {
      if (movie.overview && movie.overview.length > 10) {
        uniqueCandidatesMap.set(movie.id, movie);
      }
    });

    return Array.from(uniqueCandidatesMap.values());
  } catch {
    return [];
  }
};
