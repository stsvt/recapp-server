const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const passport = require('passport');
require('./config/passport');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');

const AppError = require('./utils/appError');
const setupSwagger = require('./utils/swagger');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tmdbRouter = require('./routes/tmdbRoutes');
const personRouter = require('./routes/personRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const movieRouter = require('./routes/movieRoutes');
const activityRouter = require('./routes/activityRoutes');

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  standardHeaders: true,
  legacyHeaders: false,
});

app.set('trust proxy', 1);

app.use('/api', limiter);

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: process.env.ORIGIN_URL, credentials: true }));

app.use(express.json({ limit: '10kb' }));
app.use(passport.initialize());

// app.use(mongoSanitize());
// app.use(xss());
// app.use(hpp());

app.set('query parser', 'extended');

setupSwagger(app);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tmdb', tmdbRouter);
app.use('/api/v1/person', personRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/activity', activityRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
