const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const UserMovieActivity = require('../models/userMovieActivityModel');
const Movie = require('../models/movieModel');
const { getOrCreateMovie } = require('../services/movieService');

exports.getUserActivities = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const movies = await UserMovieActivity.find({ user: userId }).populate(
    'movie',
  );

  if (!movies) {
    return next(new AppError('No activities found for this user', 404));
  }

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies,
    },
  });
});

exports.toggleActivity = catchAsync(async (req, res, next) => {
  const { activityType, tmdbId } = req.body;

  const userId = req.user.id;

  const allowedTypes = ['liked', 'watched'];

  if (!allowedTypes.includes(activityType)) {
    return next(new AppError('Invalid activity type', 400));
  }

  const movie = await getOrCreateMovie(tmdbId);

  const existingActivity = await UserMovieActivity.findOne({
    user: userId,
    movie: movie._id,
    activityType,
  });

  let message;
  let isActive;

  const fieldToUpdate =
    activityType === 'liked' ? 'likesCount' : 'watchesCount';

  if (existingActivity) {
    await UserMovieActivity.findByIdAndDelete(existingActivity._id);

    await Movie.findOneAndUpdate(
      {
        _id: movie._id,
        [fieldToUpdate]: { $gt: 0 },
      },
      {
        $inc: { [fieldToUpdate]: -1 },
      },
    );

    message = `Movie removed from ${activityType} list`;
    isActive = false;
  } else {
    await UserMovieActivity.create({
      user: userId,
      movie: movie._id,
      activityType: activityType,
    });

    await Movie.findByIdAndUpdate(movie._id, {
      $inc: { [fieldToUpdate]: 1 },
    });

    message = `Movie added to ${activityType} list`;
    isActive = true;
  }

  const updatedMovie = await Movie.findById(movie._id);

  res.status(200).json({
    status: 'success',
    data: {
      isActive,
      message,
      likesCount: Math.max(0, updatedMovie.likesCount),
      watchesCount: Math.max(0, updatedMovie.watchesCount),
    },
  });
});

exports.checkMovieStatus = catchAsync(async (req, res, next) => {
  const { tmdbId } = req.params;
  const userId = req.user.id;

  const movie = await Movie.findOne({ tmdbId });

  if (!movie) {
    return res.status(200).json({
      status: 'success',
      data: { liked: false, watched: false },
    });
  }

  const activities = await UserMovieActivity.find({
    user: userId,
    movie: movie._id,
  });

  const status = {
    liked: activities.some((activity) => activity.activityType === 'liked'),
    watched: activities.some((activity) => activity.activityType === 'watched'),
  };

  res.status(200).json({
    status: 'success',
    data: status,
  });
});
