const calculateUserSimilarity = (userAId, userBId, userVectors) => {
  const vecA = userVectors[userAId];
  const vecB = userVectors[userBId];

  const commonMovies = Object.keys(vecA).filter(
    (movieId) => vecB[movieId] !== undefined,
  );

  if (commonMovies.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  commonMovies.forEach((movieId) => {
    const devA = vecA[movieId];
    const devB = vecB[movieId];

    dotProduct += devA * devB;
    normA += devA * devA;
    normB += devB * devB;
  });

  if (normA === 0 || normB === 0) return 0;

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return dotProduct / denominator;
};

exports.getUserRecommendations = async (
  targetUserId,
  allRatings,
  userMeans,
) => {
  const userVectors = {};
  allRatings.forEach((rating) => {
    const uId = rating.userId.toString();
    const mId = rating.movieId.toString();
    if (!userVectors[uId]) userVectors[uId] = {};

    userVectors[uId][mId] = rating.score - userMeans[uId];
  });

  if (!userVectors[targetUserId]) return [];

  const targetUserMovies = userVectors[targetUserId];

  const similarities = [];
  Object.keys(userVectors).forEach((otherUserId) => {
    if (otherUserId === targetUserId) return;

    const similarity = calculateUserSimilarity(
      targetUserId,
      otherUserId,
      userVectors,
    );
    if (similarity > 0) {
      similarities.push({ userId: otherUserId, similarity });
    }
  });

  console.log(`--- Схожість для користувача ${targetUserId} ---`);
  console.table(similarities.sort((a, b) => b.similarity - a.similarity));

  const topSimilarUsers = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 20);

  const recommendations = {};

  topSimilarUsers.forEach((neighbor) => {
    const neighborMovies = userVectors[neighbor.userId];

    Object.keys(neighborMovies).forEach((movieId) => {
      if (targetUserMovies[movieId] === undefined) {
        if (!recommendations[movieId]) {
          recommendations[movieId] = { scoreWeight: 0, simSum: 0 };
        }
        recommendations[movieId].scoreWeight +=
          neighbor.similarity * neighborMovies[movieId];
        recommendations[movieId].simSum += neighbor.similarity;
      }
    });
  });

  const finalResults = Object.keys(recommendations).map((movieId) => {
    const rec = recommendations[movieId];
    const predictedDeviation = rec.scoreWeight / rec.simSum;

    return {
      movieId,
      prediction: parseFloat(
        (userMeans[targetUserId] + predictedDeviation).toFixed(2),
      ),
    };
  });

  return finalResults.sort((a, b) => b.prediction - a.prediction);
};
