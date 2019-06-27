global._config = require('./app/config');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./app/database/mongoConnection');
require('./app/database/redisConnection');
var indexRouter = require('./app/routes/transaction');
const ErrorHandler = require('./app/responseHandlers/errorHandler');


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  ErrorHandler.sendResponse(res,ErrorHandler.message.NOT_FOUND);
});

// error handler
app.use(function (err, req, res, next) {

  ErrorHandler.sendResponse(res,ErrorHandler.message.INTERNAL_SERVER_ERROR);
});

module.exports = app;
