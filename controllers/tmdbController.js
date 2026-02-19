const fs = require('fs');
const client = require('../utils/redisClient');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { fetchMovieFromTMDB } = require('../utils/tmdbApi');

const genres = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/genres.json`, 'utf-8'),
);

exports.getMovieGenres = (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', data: { genres } });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const sortedQuery = Object.keys(req.query)
    .sort()
    .reduce((acc, key) => {
      acc[key] = req.query[key];
      return acc;
    }, {});

  const cacheKey = `movies:${JSON.stringify(sortedQuery)}`;
  const cachedMovies = await client.get(cacheKey);

  if (cachedMovies) {
    console.log('GETTING from CACHE');
    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: { movies: JSON.parse(cachedMovies) },
    });
  }

  const tmdbParams = new URLSearchParams({
    include_adult: false,
    ...sortedQuery,
  });

  const url = `${process.env.TMDB_BASIC_URL}discover/movie?${tmdbParams}&language=uk-UA`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(new AppError('Something went wrong with fetching movies', 400));
  }

  const data = await response.json();

  const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

  await client.setEx(cacheKey, ONE_WEEK_IN_SECONDS, JSON.stringify(data));

  console.log('GETTING from external API');
  res.status(200).json({ status: 'success', data: { movies: data } });
});

exports.getMovieById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const cacheKey = `movies:details:${id}`;
  const cachedMovie = await client.get(cacheKey);

  if (cachedMovie) {
    console.log('GETTING from CACHE');

    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: { movie: JSON.parse(cachedMovie) },
    });
  }

  try {
    const data = await fetchMovieFromTMDB(id);

    if (data.original_language === 'ru') {
      return next(new AppError('Movie not available', 404));
    }

    await client.setEx(cacheKey, 21600, JSON.stringify(data));

    console.log('GETTING from external API');
    return res.status(200).json({ status: 'success', data: { movie: data } });
  } catch (err) {
    return next(new AppError('Something went wrong with fetching movie', 400));
  }
});

exports.getTopRatedMovies = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;

  const cacheKey = `movies:top_rated:page:${page}`;
  const cachedMovies = await client.get(cacheKey);

  if (cachedMovies) {
    console.log('GETTING from CACHE');

    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: { movies: JSON.parse(cachedMovies) },
    });
  }

  const tmdbParams = new URLSearchParams({
    language: 'uk-UA',
    page: page,
    sort_by: 'vote_average.desc',
    'vote_count.gte': '3000',
    include_adult: false,
  });

  const url = `${process.env.TMDB_BASIC_URL}discover/movie?${tmdbParams}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(new AppError('Failed to fetch top rated movies', 400));
  }

  const data = await response.json();

  if (data.results) {
    data.results = data.results.filter(
      (movie) => movie.original_language !== 'ru',
    );
  }

  await client.setEx(cacheKey, 86400, JSON.stringify(data));

  console.log('Top Rated from TMDB');

  res.status(200).json({
    status: 'success',
    data: { movies: data },
  });
});

exports.getUpcomingMovies = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;

  const cacheKey = `movies:upcoming:page:${page}`;
  const cachedMovies = await client.get(cacheKey);

  if (cachedMovies) {
    console.log('GETTING from CACHE');

    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: { movies: JSON.parse(cachedMovies) },
    });
  }

  const tmdbParams = new URLSearchParams({
    language: 'uk-UA',
    page: page,
    region: 'UA',
  });

  const url = `${process.env.TMDB_BASIC_URL}movie/upcoming?${tmdbParams}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(
      new AppError('Something went wrong with fetching upcoming movies', 400),
    );
  }

  const data = await response.json();

  if (data.results) {
    data.results = data.results.filter(
      (movie) => movie.original_language !== 'ru',
    );
  }

  await client.setEx(cacheKey, 86400, JSON.stringify(data));

  console.log('GETTING from external API');
  res.status(200).json({ status: 'success', data: { movies: data } });
});

exports.getNowPlayingMovies = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;

  const cacheKey = `movies:now_playing:page:${page}`;
  const cachedMovies = await client.get(cacheKey);

  if (cachedMovies) {
    console.log('GETTING from CACHE');

    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: { movies: JSON.parse(cachedMovies) },
    });
  }

  const tmdbParams = new URLSearchParams({
    language: 'uk-UA',
    page: page,
    region: 'UA',
  });

  const url = `${process.env.TMDB_BASIC_URL}movie/now_playing?${tmdbParams}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(
      new AppError(
        'Something went wrong with fetching now playing movies',
        400,
      ),
    );
  }

  const data = await response.json();

  if (data.results) {
    data.results = data.results.filter(
      (movie) => movie.original_language !== 'ru',
    );
  }

  await client.setEx(cacheKey, 86400, JSON.stringify(data));

  console.log('GETTING from external API');
  res.status(200).json({ status: 'success', data: { movies: data } });
});

exports.searchMovies = catchAsync(async (req, res, next) => {
  const { query, page = 1 } = req.query;

  if (!query) {
    return next(new AppError('Please provide a search term', 400));
  }

  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = `search:${normalizedQuery}:page:${page}`;
  const cachedResults = await client.get(cacheKey);

  if (cachedResults) {
    console.log(`Search "${query}" from CACHE`);
    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: { movies: JSON.parse(cachedResults) },
    });
  }

  const tmdbParams = new URLSearchParams({
    query: query,
    page: page,
    language: 'uk-UA',
    include_adult: false,
  });

  const url = `${process.env.TMDB_BASIC_URL}search/movie?${tmdbParams}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(new AppError('Failed to search movies', 400));
  }

  const data = await response.json();

  if (data.results) {
    data.results = data.results.filter(
      (movie) => movie.original_language !== 'ru',
    );
  }

  await client.setEx(cacheKey, 3600, JSON.stringify(data));

  console.log(`Search "${query}" from TMDB`);
  res.status(200).json({
    status: 'success',
    data: { movies: data },
  });
});
