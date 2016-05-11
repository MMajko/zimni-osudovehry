var express = require('express');

var database = require('./src/database.js');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  database.init();
  res.render('index', { title: 'Express' });
});

module.exports = router;
