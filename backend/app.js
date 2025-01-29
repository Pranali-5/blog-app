require('dotenv').config();
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const { json, urlencoded, raw } = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const status = require('express-status-monitor');
const { connectMongoDb } = require('./connection');
const blogRoute = require('./routes/blog');
const authRoute = require('./routes/auth');
const path = require('path');
const logger = require('./middleware/logger');
const redisClient = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectMongoDb(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/blog-app');

// Redis health check
app.get('/redis-health', async (req, res) => {
  try {
    await redisClient.ping();
    res.status(200).json({ status: 'Redis connection ok' });
  } catch (error) {
    res.status(500).json({ status: 'Redis connection failed', error: error.message });
  }
});

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(cors());
app.use(raw({ type: 'application/x-www-form-urlencoded' }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(logger);
app.use('/api/blogs', blogRoute);
app.use('/api/auth', authRoute);
app.use(status());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}
