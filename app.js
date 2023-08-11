const path = require('path');
const express = require('express');
const cors = require("cors");
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');



const app = express();


app.use(cookieParser());



// app.use(cors({ origin: 'http://127.0.0.1:3000'}));

// app.use(function(req, res, next) {
//   var oneof = false;
//   if(req.headers.origin) {
//       res.header('Access-Control-Allow-Origin', req.headers.origin);
//       oneof = true;
//   }
//   if(req.headers['access-control-request-method']) {
//       res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
//       oneof = true;
//   }
//   if(req.headers['access-control-request-headers']) {
//       res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
//       oneof = true;
//   }
//   if(oneof) {
//       res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
//   }

//   // intercept OPTIONS method
//   if (oneof && req.method == 'OPTIONS') {
//       res.send(200);
//   }
//   else {
//       next();
//   }
// });

app.use(cors());



app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));





// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log("this is the cookie which is gneerteed and sent witth each of the reqeuest")

  console.log("_____________________________Hello there")
  console.log(req.cookies);
  console.log('this is from the middleware which consoles')
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
