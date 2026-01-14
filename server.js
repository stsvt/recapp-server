const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} port`);
});
