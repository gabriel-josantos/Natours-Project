//NPM MODULES

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
// App Modules
//
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/////////////////CHALENGES//////////////////////////////////
// 1)Remember to implement maximum login attempts
// 2)Users can only review a tour that they actually booked
// 3)Implement nested booking routes, get all the booking for a certain tour and also getting all the bookings for a certain user
// 4)Improve tour dates: add participants and a soldOut field to each date. A date then becomes like an instance of the tour.
// Then when a user books, they need to select one of the dates, A new booking will increase the number of participants until it is booked out.
// And then check if the tour is still available
// 5) Confirm user email, refresh token to get users logged in, two factor authntications
// 6) On the tour detail page, if a user has taken a tour allow then to
// add a review on the website, hint:the time of the tour must have already passed
// 7) Hide entire booking section if current user has already bought the tour
// And prevent duplicate bookings
// 8) Implement "like tour" functionality and have a favorites page on the website
// 9) Add "My reviews" to user account page, where all reviews are displayed and user can edit them(very good to practice React)
// 10) For administrators implement Manage pages where they can CRUD

//////////////////////////////////////////////
// 1) GLOBAL MIDDLEWARES
// Implement cors
app.use(cors());
//Access-Control-Allow-Origin
// api.natours.com,front-end:natours.com
// app.use(
//   cors({
//     origin: 'https://ww.natours.com',
//   })
// );

app.options('*', cors());
//app.options('api/v1/tours/:id',cors());

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
//app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'ws://127.0.0.1:*'],
      scriptSrc: [
        "'self'",
        'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js',
        'ajax.googleapis.com *',
      ],
      styleSrc: ["'self'", 'fonts.googleapis.com'],
      fontSrc: ['fonts.gstatic.com'],
      upgradeInsecureRequests: [],
    },
  })
);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in a hour!',
});
app.use(cookieParser());

app.use('/api', limiter);

// Body Parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
//app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanatization against NoSQL query injection
app.use(mongoSanitize());

// Data sanatization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());
// Test middleware

// ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
