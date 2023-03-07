const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.alerts = function (req, res, next) {
  const alert = req.query.alert;
  if (alert === 'booking')
    res.locals.alert =
      'Your booking was successful! Please check your email for a confirmation. If your booking doesnt show up here immediatly, please come back later';
  next();
};

exports.getOverview = catchAsync(async function (req, res, next) {
  //1) Get tour data from collection
  const tours = await Tour.find();

  //2) Build template
  //3) render that template using tour data from 1

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('overview', {
      title: 'All tours',
      tours,
    });
});

exports.getTour = catchAsync(async function (req, res, next) {
  //1) get the data for the requested tour (includes reviews and tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  //2) Build template
  //3) Render tmplate using data from 1
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = function (req, res) {
  //const user= await User

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login', {
      title: 'Login into your account',
    });
};

exports.getAccount = function (req, res) {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('account', {
      title: 'Your account',
    });
};

exports.getMyTours = catchAsync(async function (req, res, next) {
  //1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  //2) Find tours with the returned IDs
  const toursIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: toursIDs } });
  //const tourIDs = bookings.map((el) => el.tour);
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('overview', {
      title: 'My Tours',
      tours,
    });
});

exports.getSignUpForm = function (req, res) {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('signup', {
      title: 'Create your account',
    });
};

exports.getForgetPasswordForm = function (req, res) {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('forgetPassword', {
      title: 'Forgot Password',
    });
};

exports.getResetPasswordForm = function (req, res) {
  const token = req.params.token;
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('resetPassword', {
      title: 'Change your password',
      token,
    });
};
// exports.updateUserData = catchAsync(async function (req, res, next) {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser,
//   });
// });
