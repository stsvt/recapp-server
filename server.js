const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

require('./utils/redisClient');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('Server was successfully connected to database'));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} port`);
});

const io = new Server(server, {
  cors: { origin: process.env.ORIGIN_URL, credentials: true },
  methods: ['GET', 'POST'],
});

const activeUsers = new Map();

app.set('io', io);
app.set('activeUsers', activeUsers);

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('register_user', (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    activeUsers.forEach((value, key) => {
      if (value === socket.id) {
        activeUsers.delete(key);
      }
    });
  });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
