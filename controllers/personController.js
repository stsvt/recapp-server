const client = require('../utils/redisClient');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getDirectorWorks = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const cacheKey = `person:works:${id}`;
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    console.log('Director works from CACHE');
    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: JSON.parse(cachedData),
    });
  }

  const url = `${process.env.TMDB_BASIC_URL}person/${id}/combined_credits?language=uk-UA`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(new AppError('Failed to fetch director works', 404));
  }

  const data = await response.json();

  const directedWorks = data.crew
    .filter((item) => item.job === 'Director')
    .map((item) => ({
      id: item.id,
      title: item.title || item.name,
      media_type: item.media_type,
      poster_path: item.poster_path,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.release_date || 0);
      const dateB = new Date(b.release_date || 0);
      return dateB - dateA;
    });

  await client.setEx(cacheKey, 604800, JSON.stringify(directedWorks));

  console.log('Director works from TMDB');
  res.status(200).json({
    status: 'success',
    data: { works: directedWorks },
  });
});

exports.getActorMovies = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const cacheKey = `person:actor:${id}`;
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    console.log('Actor movies from CACHE');
    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: JSON.parse(cachedData),
    });
  }

  const url = `${process.env.TMDB_BASIC_URL}person/${id}/combined_credits?language=uk-UA`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(new AppError('Failed to fetch actor movies', 404));
  }

  const data = await response.json();
  const actorMovies = data.cast
    .map((item) => ({
      id: item.id,
      title: item.title || item.name,
      media_type: item.media_type,
      poster_path: item.poster_path,
      character: item.character,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.release_date || 0);
      const dateB = new Date(b.release_date || 0);
      return dateB - dateA;
    });

  await client.setEx(cacheKey, 604800, JSON.stringify(actorMovies));

  console.log('Actor movies from TMDB');
  res.status(200).json({
    status: 'success',
    data: { movies: actorMovies },
  });
});

exports.getPersonInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const cacheKey = `person:info:${id}`;
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    console.log('Person info from CACHE');
    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: JSON.parse(cachedData),
    });
  }

  const url = `${process.env.TMDB_BASIC_URL}person/${id}?language=uk-UA&append_to_response=images`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    return next(new AppError('Failed to fetch person information', 404));
  }

  const data = await response.json();

  const personInfo = {
    id: data.id,
    name: data.name,
    birthday: data.birthday,
    deathday: data.deathday,
    place_of_birth: data.place_of_birth,
    biography: data.biography,
    known_for_department: data.known_for_department,
    profile_path: data.profile_path,
    images: data.images && data.images.profiles ? data.images.profiles : [],
  };

  await client.setEx(cacheKey, 604800, JSON.stringify({ person: personInfo }));

  console.log('Person info from TMDB');
  res.status(200).json({
    status: 'success',
    data: { person: personInfo },
  });
});
