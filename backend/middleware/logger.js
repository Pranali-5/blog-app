const pino = require('pino');
const path = require('path');
const fs = require('fs');

const logFilePath = path.join(__dirname, '../logs/api_requests.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: 'info',
  destination: logStream, // Log to file in production
});

const logMiddleware = (req, res, next) => {
  const logEntry = {
    time: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
  };

  // Log the entry
  logger.info(logEntry);

  next();
};

module.exports = logMiddleware; 