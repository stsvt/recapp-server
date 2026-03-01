const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Reaction must belong to a user.'],
  },
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: 'Movie',
    required: [true, 'Reaction must belong to a movie.'],
  },
  reactionType: {
    type: String,
    enum: ['fire', 'mindblown', 'crying', 'laughing', 'eyesWithHearts'],
    required: [true, 'Reaction must have a type.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

schema.index({ user: 1, movie: 1 }, { unique: true });

const MovieReaction = mongoose.model('MovieReaction', schema);
module.exports = MovieReaction;
