const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/api_requests.log');

const logger = (req, res, next) => {
  const logEntry = `${new Date().toLocaleString('en-IN')} - ${req.ip} - ${req.method} ${req.originalUrl}\n`;
  
  // Append the log entry to the log file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });

  next();
};

module.exports = logger; 