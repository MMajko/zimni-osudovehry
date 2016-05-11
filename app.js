var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var routes = require('./router');

// TODO: use theme from environment!
var __themedir = path.join(__dirname, 'theme/' + (process.env.THEME || 'zimni-2016'));

var app = express();

// view engine setup
app.set('views', path.join(__themedir, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__themedir, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  root: path.join(__themedir, '/public'),
  src: 'sass',
  dest: 'css',
  debug: true,
  outputstyle: 'compressed',
  prefix: '/css'
}));
app.use(express.static(path.join(__themedir, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
