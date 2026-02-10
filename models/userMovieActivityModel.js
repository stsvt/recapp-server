const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Activity must belong to a user.'],
  },
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: 'Movie',
    required: [true, 'Activity must belong to a movie.'],
  },
  activityType: {
    type: String,
    enum: ['liked', 'watched'],
    required: [true, 'Activity must have a type.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

schema.index({ user: 1, movie: 1, activityType: 1 }, { unique: true });

schema.pre(/^find/, function () {
  this.populate({
    path: 'movie',
    select: 'title posterPath ratingsAverage releaseDate genres',
  });
});

const UserMovieActivity = mongoose.model('UserMovieActivity', schema);
module.exports = UserMovieActivity;
