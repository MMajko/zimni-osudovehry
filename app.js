var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var hbs = require('hbs');

var router = require('./router');
var helpers = require('./src/helpers');

// TODO: use theme from environment!
var __themedir = path.join(__dirname, 'theme', process.env.THEME || 'zimni-2016');

var app = express();

/**
 * View engine setup.
 */

app.set('views', path.join(__themedir, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__themedir, 'views', 'partials'));

/**
 * Middlewares.
 */

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

/**
 * Setup router.
 */

app.use('/', router);

/**
 * Error handlers.
 */

app.use(function(req, res, next) {
  var err = new Error('404 Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/**
 * Register handlebars helpers
 */

hbs.registerHelper('date', helpers.date);

module.exports = app;
