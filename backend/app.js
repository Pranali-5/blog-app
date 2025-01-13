require('dotenv').config();

const express = require('express');
const { json, urlencoded, raw } = require('body-parser');
// const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors')
const status = require('express-status-monitor')
const { connectMongoDb } = require('./connection');

const blogRoute = require('./routes/blog');
const authRoute = require('./routes/auth');
const path = require('path');
const logger = require('./middleware/logger'); // Import the logger middleware

const app = express();
const PORT = process.env.PORT || 8080;

connectMongoDb(
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/blog-app',
); //

app.use(helmet()); // this is needed to secure the app  from some well-known web vulnerabilities by setting HTTP headers appropriately.

// const limiter = rateLimit({
//   max: 110,
//   windowMs: 60 * 60 * 1000, // 60 minutes,
//   message: 'Too many requests from this IP, please try again in an hour.'
// })

// app.use('/api', limiter);

app.use(mongoSanitize()); // this is needed to ensure that noSQL query injection is prevented. e.g. {"email": $gt: "", password: "1234"}
app.use(xss()); // this is needed to prevent cross-site scripting attacks by sanitizing user input coming from POST body, GET queries, and url params.

// Middleware to set CORS header

// app.use((req, res, next) => {

//   res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin (be cautious with this)

//   next();

// });
 const corsOptions = {
     origin: '*', // Replace with your frontend URL
     optionsSuccessStatus: 200,
   };

app.use(cors(corsOptions))

app.options('*', cors(corsOptions));

// Set Cross-Origin-Resource-Policy header
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // or 'same-site'
  next();
});

app.use(
  raw({
    type: 'application/x-www-form-urlencoded',
  }),
);
app.use(json());
app.use(urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use the logger middleware
app.use(logger);

app.use('/api/blogs', blogRoute);
app.use('/api/auth', authRoute);
app.use(status())

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
