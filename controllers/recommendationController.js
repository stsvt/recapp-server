const catchAsync = require('../utils/catchAsync');
const RecommendationService = require('../services/recommendationService');
const client = require('../utils/redisClient');
const AppError = require('../utils/appError');

exports.getContentBasedRecommendations = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const cacheKey = `movies:recommendations:content-based:${userId}`;
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    console.log('Content based recommendations from CACHE');
    return res.status(200).json({
      status: 'success',
      source: 'cache',
      data: JSON.parse(cachedData),
    });
  }

  const recommendations =
    await RecommendationService.getPersonalRecommendations(userId);

  if (!recommendations || recommendations.length === 0) {
    return next(new AppError('No recommendations found for this user', 404));
  }

  return res.status(200).json({
    status: 'success',
    results: recommendations.length,
    data: { recommendations },
  });
});
