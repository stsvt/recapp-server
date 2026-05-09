const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
    movie: {
      type: mongoose.Schema.ObjectId,
      ref: 'Movie',
      required: [true, 'Review must belong to a movie.'],
    },
    review: {
      type: String,
      minLength: 5,
      maxLength: 300,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

schema.index(
  { movie: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: { active: true },
  },
);

schema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});

schema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

schema.statics.calcAverageRatings = async function (movieId) {
  const stats = await this.aggregate([
    { $match: { movie: movieId, active: { $ne: false } } },
    {
      $group: {
        _id: '$movie',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Movie').findByIdAndUpdate(movieId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await mongoose.model('Movie').findByIdAndUpdate(movieId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

schema.post('save', function () {
  this.constructor.calcAverageRatings(this.movie);
});

schema.post(/^findOneAnd/, async (doc) => {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.movie);
  }
});

const Review = mongoose.model('Review', schema);
module.exports = Review;
