const stopWords = require('../data/stopWords');

const PUNCTUATION_REMOVAL_REGEX = /[^\w\sа-яіїєґ]/gi;
const ANY_WHITESPACE_REMOVAL_REGEX = /\s+/g;

exports.tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(PUNCTUATION_REMOVAL_REGEX, '')
    .split(ANY_WHITESPACE_REMOVAL_REGEX)
    .filter((word) => word.length > 2 && !stopWords.has(word));
};

exports.calculateTF = (tokens) => {
  const tf = {};
  const totalTerms = tokens.length;

  if (totalTerms === 0) {
    return tf;
  }

  tokens.forEach((token) => {
    tf[token] = (tf[token] || 0) + 1;
  });

  Object.keys(tf).forEach((token) => {
    tf[token] /= totalTerms;
  });

  return tf;
};

exports.calculateIDF = (corpus) => {
  const idf = {};
  const totalDocs = corpus.length;

  corpus.forEach((tokens) => {
    const uniqueWordsInDoc = new Set(tokens);

    uniqueWordsInDoc.forEach((word) => {
      idf[word] = (idf[word] || 0) + 1;
    });
  });

  Object.keys(idf).forEach((word) => {
    const documentFrequency = idf[word];
    idf[word] = 1 + Math.log((totalDocs + 1) / (documentFrequency + 1));
  });

  return idf;
};

exports.vectorizeAndNormalize = (tf, idf) => {
  const vector = {};
  let sumOfSquares = 0;

  Object.keys(tf).forEach((token) => {
    const tfIdfValue = tf[token] * (idf[token] || 1.0);
    vector[token] = tfIdfValue;

    sumOfSquares += tfIdfValue * tfIdfValue;
  });

  const l2Norm = Math.sqrt(sumOfSquares);

  Object.keys(vector).forEach((token) => {
    vector[token] = l2Norm === 0 ? 0 : vector[token] / l2Norm;
  });

  return vector;
};

exports.getCosineSimilarity = (vecA, vecB) => {
  let score = 0; // 0.00 - 1.00

  Object.keys(vecA).forEach((token) => {
    if (vecB[token]) {
      score += vecA[token] * vecB[token];
    }
  });

  return score;
};
