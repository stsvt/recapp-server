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
