const fs = require('fs');
const client = require('../utils/redisClient');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
    language: 'uk-UA',
    include_adult: false,
    ...sortedQuery,
  });

  const url = `${process.env.TMDB_BASIC_URL}discover/movie?${tmdbParams}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(new AppError('Something went wrong with fetching movies', 400));
  }

  const data = await response.json();

  await client.set(cacheKey, JSON.stringify(data));

  console.log('GETTING from external API');
  res.status(200).json({ status: 'success', data: { movies: data } });
});
