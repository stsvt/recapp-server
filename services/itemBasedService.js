const calculateUserMeans = (rating) => {
  const userStats = {};
  rating.forEach(({ userId, score }) => {
    const uId = userId.toString();
    if (!userStats[uId]) userStats[uId] = { sum: 0, count: 0 };
    userStats[uId].sum += score;
    userStats[uId].count += 1;
  });

  const means = {};
  Object.entries(userStats).forEach(([userId, stats]) => {
    means[userId] = stats.sum / stats.count;
  });
  return means;
};
exports.calculateUserMeans = calculateUserMeans;

const calculatePearsonCorrelation = (movieA, movieB, vectors) => {
  const vecA = vectors[movieA];
  const vecB = vectors[movieB];

  const commonUsers = Object.keys(vecA).filter(
    (user) => vecB[user] !== undefined,
  );

  if (commonUsers.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  commonUsers.forEach((userId) => {
    const devA = vecA[userId];
    const devB = vecB[userId];

    dotProduct += devA * devB;
    normA += devA ** 2;
    normB += devB ** 2;
  });

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
};

exports.getRecommendationsForMovie = async (targetMovieId, allRatings) => {
  const userMeans = calculateUserMeans(allRatings);

  const vectors = {};
  allRatings.forEach((r) => {
    const mId = r.movieId.toString();
    const uId = r.userId.toString();
    if (!vectors[mId]) vectors[mId] = {};
    vectors[mId][uId] = r.score - userMeans[uId];
  });

  console.log(`Vectors for movie: ${targetMovieId}`);
  console.table(vectors[targetMovieId]);

  if (!vectors[targetMovieId]) return [];

  const recommendations = [];
  Object.keys(vectors).forEach((movieId) => {
    if (movieId === targetMovieId) return;

    const similarity = calculatePearsonCorrelation(
      targetMovieId,
      movieId,
      vectors,
    );

    if (similarity > 0) {
      recommendations.push({
        movieId,
        similarity: parseFloat(similarity.toFixed(4)),
      });
    }
  });

  return recommendations.sort((a, b) => b.similarity - a.similarity);
};
