const { createClient } = require('redis');

const redisUrl =
  process.env.REDIS_CONNECTION_STRING || 'redis://127.0.0.1:6379';

const client = createClient({ url: redisUrl });

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
