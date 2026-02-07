const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: [true, 'Movie must have a TMDB ID.'],
    unique: true,
  },
  title: { type: String, required: [true, 'Movie must have a title.'] },
  posterPath: { type: String },
  releaseDate: { type: Date },
  overview: { type: String },
  genres: [{ type: String }],
  ratingsAverage: {
    type: Number,
    default: 0,
    set: (value) => Math.round(value * 10) / 10,
  },
  ratingsQuantity: { type: Number, default: 0 },
});

schema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'movie',
  localField: '_id',
});
const Movie = mongoose.model('Movie', schema);
module.exports = Movie;
