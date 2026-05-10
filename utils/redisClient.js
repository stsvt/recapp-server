const { createClient } = require('redis');

const redisUrl =
  process.env.REDIS_URL ||
  process.env.REDIS_CONNECTION_STRING ||
  'redis://127.0.0.1:6379';

const isProduction = process.env.NODE_ENV === 'production';

const client = createClient({
  url: redisUrl,
  socket: isProduction
    ? {
        tls: true,
        rejectUnauthorized: false,
      }
    : undefined,
});

client.on('error', (err) => console.log('Redis Client error', err));

client
  .connect()
  .then(() => console.log('Redis connected successfully'))
  .catch((err) => {
    console.warn(
      'Redis connection failed — caching disabled:',
      err.message,
    );
  });

module.exports = client;