var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var dashboardRouter = require('./routes/dashboard');

var electionlistRouter = require('./routes/electionlist');
var viewelectionRouter = require('./routes/viewelection');
var voteelectionRouter = require('./routes/voteelection');
var logoutRouter = require('./routes/logout');
var electionInfoRouter = require('./routes/getelectioninfo');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/register', registerRouter);

app.use('/electionlist', electionlistRouter);
app.use('/viewelection', viewelectionRouter);
app.use('/logout', logoutRouter);
app.use('/voteelection', voteelectionRouter);
app.use('/getelectionInfo', electionInfoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
